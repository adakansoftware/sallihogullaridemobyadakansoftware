import { Resend } from 'resend'
import { ApiError } from './api-error.ts'
import { env } from './env.ts'

export type ContactMailPayload = {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

const CONTACT_MAIL_TO = 'teklif@salihogullari.com'
const MAIL_RETRY_DELAY_MS = 750

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildMailHtml(payload: ContactMailPayload, reference: string) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 16px;">Yeni Teklif / İletişim Talebi</h2>
      <p><strong>Talep Referansı:</strong> ${escapeHtml(reference)}</p>
      <p><strong>Ad Soyad:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(payload.phone || '-')}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(payload.email || '-')}</p>
      <p><strong>İş Kapsamı:</strong> ${escapeHtml(payload.subject)}</p>
      <p><strong>Saha Bilgisi:</strong></p>
      <div style="white-space: pre-wrap; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">${escapeHtml(payload.message)}</div>
    </div>
  `
}

function buildMailText(payload: ContactMailPayload, reference: string) {
  return [
    'Yeni Teklif / İletişim Talebi',
    `Talep Referansı: ${reference}`,
    `Ad Soyad: ${payload.name}`,
    `Telefon: ${payload.phone || '-'}`,
    `E-posta: ${payload.email || '-'}`,
    `İş Kapsamı: ${payload.subject}`,
    'Saha Bilgisi:',
    payload.message,
  ].join('\n')
}

// Single delivery attempt. A missing API key is a mock in development but a
// hard failure in production. A Resend-side `error` payload is treated as a
// failed delivery (the previous implementation silently ignored it).
export async function deliverContactMailOnce(payload: ContactMailPayload, reference: string) {
  if (!env.RESEND_API_KEY) {
    if (env.NODE_ENV !== 'production') {
      console.log('[mock-contact-email]', { to: CONTACT_MAIL_TO, reference, payload })
      return
    }

    throw new ApiError(500, 'E-posta servisi şu anda yapılandırılmamış.')
  }

  const resend = new Resend(env.RESEND_API_KEY)
  const result = await resend.emails.send({
    from: env.RESEND_FROM || 'onboarding@resend.dev',
    to: [CONTACT_MAIL_TO],
    subject: `Yeni Talep: ${payload.subject}`,
    html: buildMailHtml(payload, reference),
    text: buildMailText(payload, reference),
    replyTo: payload.email || undefined,
  })

  if (result.error) {
    throw new ApiError(500, 'E-posta gönderimi sağlayıcı tarafından reddedildi.')
  }
}

export async function sendContactMail(payload: ContactMailPayload, reference: string) {
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await deliverContactMailOnce(payload, reference)
      return
    } catch (error) {
      lastError = error
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, MAIL_RETRY_DELAY_MS))
      }
    }
  }

  throw lastError
}
