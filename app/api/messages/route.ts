import { jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { messageInputSchema } from '@/lib/validation'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { writeAuditLog } from '@/lib/audit'
import { listAdminMessages, submitContactMessage } from '@/lib/message-service'

export async function GET(request: Request) {
  return withErrorHandling(async () => {
    await assertAdminRequest(request)
    return jsonOk(await listAdminMessages())
  })
}

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'contact', 6, 15 * 60 * 1000)
    const payload = await readJson(request, messageInputSchema)
    const item = await submitContactMessage(payload)

    await writeAuditLog({ action: 'contact.submit', status: 'success', ip, target: item.id })
    return jsonOk({ success: true, message: 'Talebiniz başarıyla alındı.', reference: item.reference }, { status: 201 })
  })
}

