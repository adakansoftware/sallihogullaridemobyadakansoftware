import { jsonError, withErrorHandling } from '@/lib/http'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'

const UPLOAD_DISABLED_MESSAGE = 'Dosya yükleme bu kurulumda kapalıdır. Görseller public/images altında yönetilir; video için YouTube bağlantısı kullanılır.'

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    await assertAdminRequest(request)
    await enforceRateLimit(request, 'admin:upload:disabled', 10, 10 * 60 * 1000)
    return jsonError(410, UPLOAD_DISABLED_MESSAGE)
  }, 'upload.post')
}

export async function DELETE(request: Request) {
  return withErrorHandling(async () => {
    await assertAdminRequest(request)
    await enforceRateLimit(request, 'admin:upload:cleanup:disabled', 10, 10 * 60 * 1000)
    return jsonError(410, UPLOAD_DISABLED_MESSAGE)
  }, 'upload.delete')
}
