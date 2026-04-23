import { jsonError, jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { mediaUpdateSchema } from '@/lib/validation'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { writeAuditLog } from '@/lib/audit'
import { deleteProjectMedia, updateProjectMedia } from '@/lib/project-service'

type Params = { params: Promise<{ mediaId: string }> }

export async function DELETE(request: Request, { params }: Params) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:media:delete', 30, 10 * 60 * 1000)
    await assertAdminRequest(request)

    const { mediaId } = await params
    const deleted = await deleteProjectMedia(mediaId)

    if (!deleted) {
      return jsonError(404, 'Medya bulunamadı.')
    }

    await writeAuditLog({ action: 'media.delete', status: 'success', ip, target: mediaId })
    return jsonOk({ success: true })
  })
}

export async function PATCH(request: Request, { params }: Params) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:media:update', 40, 10 * 60 * 1000)
    await assertAdminRequest(request)

    const { mediaId } = await params
    const payload = await readJson(request, mediaUpdateSchema)
    const updated = await updateProjectMedia(mediaId, payload)

    if (!updated) {
      return jsonError(404, 'Medya bulunamadı.')
    }

    await writeAuditLog({ action: 'media.update', status: 'success', ip, target: mediaId })
    return jsonOk(updated)
  })
}
