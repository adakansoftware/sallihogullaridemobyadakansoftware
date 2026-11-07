import crypto from 'node:crypto'
import { jsonOk, readJson, withErrorHandling, ApiError } from '@/lib/http'
import { messageInputSchema } from '@/lib/validation'
import { assertTrustedMutationRequest, enforceIdentifierRateLimit, enforceRateLimit } from '@/lib/security'
import { assertRequestBodySize, assertRequestContentType } from '@/lib/request-guards'
import { writeAuditLog } from '@/lib/audit'
import { submitContactMessage } from '@/lib/message-service'
import { logError } from '@/lib/logger'
import { sendContactMail } from '@/lib/email'
import { flushContactMailOutbox, queueContactMailFailure } from '@/lib/email-outbox'

const CONTACT_REQUEST_MAX_BYTES = 8 * 1024

function buildReference() {
  return crypto.randomUUID().split('-')[0]?.toUpperCase() || 'TLP'
}

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    assertTrustedMutationRequest(request)
    assertRequestContentType(request, ['application/json'])
    assertRequestBodySize(request, CONTACT_REQUEST_MAX_BYTES)
    const ip = await enforceRateLimit(request, 'contact', 6, 15 * 60 * 1000)
    const payload = await readJson(request, messageInputSchema, CONTACT_REQUEST_MAX_BYTES)

    if (payload.email) {
      await enforceIdentifierRateLimit(payload.email, 'contact:email', 4, 30 * 60 * 1000)
    }
    if (payload.phone) {
      await enforceIdentifierRateLimit(payload.phone, 'contact:phone', 4, 30 * 60 * 1000)
    }
    await enforceIdentifierRateLimit(`${payload.subject}|${payload.message.slice(0, 160)}`, 'contact:message', 3, 30 * 60 * 1000)

    let reference = buildReference()
    let target = reference

    try {
      const item = await submitContactMessage(payload)
      reference = item.reference || reference
      target = item.id
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        throw error
      }

      logError('contact-storage-failed', { error })
    }

    try {
      await sendContactMail(payload, reference)
    } catch (error) {
      // The submission is already persisted and visible under /admin/messages.
      // Email delivery is a best-effort notification, so a missing key or a
      // provider outage must not turn a stored submission into a user-facing
      // failure. Queue it for retry instead of losing it.
      logError('contact-email-failed', { error, reference })

      try {
        await queueContactMailFailure(payload, reference, error)
        await flushContactMailOutbox()
      } catch (outboxError) {
        logError('contact-email-outbox-failed', { error: outboxError, reference })
      }
    }

    await writeAuditLog({ action: 'contact.submit', status: 'success', ip, target })

    return jsonOk(
      {
        success: true,
        message: 'Talebiniz başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.',
        reference,
      },
      { status: 201 },
    )
  }, 'contact.post')
}
