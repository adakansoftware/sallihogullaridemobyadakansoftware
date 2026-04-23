import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { z } from 'zod'
import { jsonError, jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { writeAuditLog } from '@/lib/audit'
import { isAllowedFileSignature } from '@/lib/upload-security'
import { isManagedUploadUrl, readProjects, safeDeleteManagedUploadIfOrphan } from '@/lib/store'

const MAX_FILE_SIZE = 25 * 1024 * 1024
const ALLOWED_TYPES: Record<string, { extension: string; resourceType: 'image' | 'video' }> = {
  'image/jpeg': { extension: 'jpg', resourceType: 'image' },
  'image/png': { extension: 'png', resourceType: 'image' },
  'image/webp': { extension: 'webp', resourceType: 'image' },
  'image/avif': { extension: 'avif', resourceType: 'image' },
  'video/mp4': { extension: 'mp4', resourceType: 'video' },
  'video/webm': { extension: 'webm', resourceType: 'video' },
  'video/quicktime': { extension: 'mov', resourceType: 'video' },
}

const uploadCleanupSchema = z.object({
  fileUrl: z.string().trim().min(1, 'Dosya adresi zorunludur.'),
})

function sanitizeBaseName(name: string) {
  return path
    .basename(name, path.extname(name))
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:upload', 20, 10 * 60 * 1000)
    await assertAdminRequest(request)

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return jsonError(400, 'Dosya bulunamadı.')
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return jsonError(400, 'Dosya boyutu sınırı aşıldı.')
    }

    const allowedType = ALLOWED_TYPES[file.type]
    if (!allowedType) {
      return jsonError(400, 'Bu dosya türüne izin verilmiyor.')
    }

    const buffer = new Uint8Array(await file.arrayBuffer())
    if (!isAllowedFileSignature(file.type, buffer)) {
      await writeAuditLog({ action: 'upload.rejected', status: 'rejected', ip, detail: `signature:${file.type}` })
      return jsonError(400, 'Dosya içeriği doğrulanamadı.')
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const safeName = sanitizeBaseName(file.name) || 'media'
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

    const { fileUrl } = await readJson(request, uploadCleanupSchema)
    if (!isManagedUploadUrl(fileUrl)) {
      return jsonError(400, 'Geçersiz dosya adresi.')
    }

    await safeDeleteManagedUploadIfOrphan(fileUrl, await readProjects())
    await writeAuditLog({ action: 'upload.cleanup', status: 'success', ip, target: fileUrl })
    return jsonOk({ success: true })
  })
}

