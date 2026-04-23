import { jsonNoStore, withErrorHandling, getClientIp } from '@/lib/http'
import { clearAdminSession } from '@/lib/auth'
import { assertTrustedMutationRequest } from '@/lib/security'
import { writeAuditLog } from '@/lib/audit'

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    assertTrustedMutationRequest(request)
    await clearAdminSession()
    await writeAuditLog({
      action: 'admin.logout',
      status: 'success',
      ip: getClientIp(request),
    })

    return jsonNoStore({ success: true })
  })
}
