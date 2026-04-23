import crypto from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { z } from 'zod'
import { writeAuditLog } from '@/lib/audit'
import { jsonError, jsonOk, readJson, withErrorHandling } from '@/lib/http'
import {
  assertAdminRequest,
  enforceRateLimit,
} from '@/lib/security'
import { assertRequestBodySize, assertRequestContentType } from '@/lib/request-guards'
import { isManagedUploadUrl, readProjects, safeDeleteManagedUploadIfOrphan } from '@/lib/store'
import {
  ALLOWED_UPLOAD_TYPES,
  hasAllowedUploadExtension,
  MAX_UPLOAD_FILE_SIZE,
  sanitizeUploadBaseName,
} from '@/lib/upload-policy'
import { isAllowedFileSignature } from '@/lib/upload-security'

const uploadCleanupSchema = z.object({
  fileUrl: z.string().trim().min(1, 'Dosya adresi zorunludur.'),
})
const UPLOAD_CLEANUP_MAX_BYTES = 1024

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:upload', 20, 10 * 60 * 1000)
    await assertAdminRequest(request)
    assertRequestContentType(request, ['multipart/form-data'])
    assertRequestBodySize(request, MAX_UPLOAD_FILE_SIZE + 64 * 1024)

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return jsonError(400, 'Dosya bulunamadi.')
    }

    if (file.size <= 0 || file.size > MAX_UPLOAD_FILE_SIZE) {
      return jsonError(400, 'Dosya boyutu siniri asildi.')
    }

    const allowedType = ALLOWED_UPLOAD_TYPES[file.type]
    if (!allowedType) {
      return jsonError(400, 'Bu dosya turune izin verilmiyor.')
    }

    if (!hasAllowedUploadExtension(file.name, allowedType.extension)) {
      await writeAuditLog({ action: 'upload.rejected', status: 'rejected', ip, detail: `extension:${file.type}` })
      return jsonError(400, 'Dosya uzantisi ile turu uyusmuyor.')
    }

    const buffer = new Uint8Array(await file.arrayBuffer())
    if (!isAllowedFileSignature(file.type, buffer)) {
      await writeAuditLog({ action: 'upload.rejected', status: 'rejected', ip, detail: `signature:${file.type}` })
      return jsonError(400, 'Dosya icerigi dogrulanamadi.')
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const safeName = sanitizeUploadBaseName(file.name) || 'media'
    const fileName = `${Date.now()}-${safeName}-${crypto.randomUUID()}.${allowedType.extension}`
    const filePath = path.join(uploadDir, fileName)
    await fs.writeFile(filePath, Buffer.from(buffer))

    await writeAuditLog({ action: 'upload.create', status: 'success', ip, target: fileName })
    return jsonOk({
      secure_url: `/uploads/${fileName}`,
      resource_type: allowedType.resourceType,
      format: allowedType.extension,
      original_name: safeName,
    })
  })
}

export async function DELETE(request: Request) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:upload:cleanup', 30, 10 * 60 * 1000)
    await assertAdminRequest(request)
    assertRequestContentType(request, ['application/json'])
    assertRequestBodySize(request, UPLOAD_CLEANUP_MAX_BYTES)

    const { fileUrl } = await readJson(request, uploadCleanupSchema)
    if (!isManagedUploadUrl(fileUrl)) {
      return jsonError(400, 'Gecersiz dosya adresi.')
    }

    await safeDeleteManagedUploadIfOrphan(fileUrl, await readProjects())
    await writeAuditLog({ action: 'upload.cleanup', status: 'success', ip, target: fileUrl })
    return jsonOk({ success: true })
  })
}
