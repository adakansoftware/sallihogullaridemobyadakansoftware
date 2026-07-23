import crypto from 'crypto'

export function anonymizeAuditIp(ip: string | undefined, secret: string) {
  if (!ip || ip === 'unknown') return undefined
  return crypto.createHmac('sha256', secret).update(ip).digest('base64url').slice(0, 20)
}
