import { jsonError, jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { mediaInputSchema } from '@/lib/validation'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { writeAuditLog } from '@/lib/audit'
import { attachMediaToProject } from '@/lib/project-service'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:media:create', 30, 10 * 60 * 1000)
    await assertAdminRequest(request)

    const { id } = await params
    const payload = await readJson(request, mediaInputSchema)
    const media = await attachMediaToProject(id, payload)
    if (!media) return jsonError(404, 'Proje bulunamadı.')

    await writeAuditLog({ action: 'media.attach', status: 'success', ip, target: id, detail: media.id })
    return jsonOk(media, { status: 201 })
  })
}

