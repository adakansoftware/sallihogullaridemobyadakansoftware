const PLACEHOLDER_PHONE_PATTERNS = [/555\s*555/i, /905555555555/i]

export function isRealPhoneValue(value?: string) {
  const normalized = (value || '').trim()
  if (!normalized) return false

  return !PLACEHOLDER_PHONE_PATTERNS.some((pattern) => pattern.test(normalized.replace(/\s+/g, '')))
}

export function isRealWhatsAppUrl(value?: string) {
  const normalized = (value || '').trim()
  if (!normalized) return false

  return normalized.startsWith('https://wa.me/') && !PLACEHOLDER_PHONE_PATTERNS.some((pattern) => pattern.test(normalized))
}
