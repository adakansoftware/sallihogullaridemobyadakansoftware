function normalizeIpCandidate(value: string) {
  const normalized = value.trim().replace(/^\[|\]$/g, '')
  if (!normalized) return null
  if (normalized.length > 120) return null
  if (!/^[a-fA-F0-9:.\-]+$/.test(normalized)) return null
  return normalized
}

export function getClientIp(request: Request) {
  // Hosting providers replace these headers at the edge. Prefer their dedicated
  // client-IP headers before the generic proxy header, which may be client supplied
  // on a self-hosted origin unless the reverse proxy strips it.
  const providerIp = request.headers.get('x-vercel-forwarded-for') || request.headers.get('cf-connecting-ip')
  const normalizedProviderIp = providerIp ? normalizeIpCandidate(providerIp) : null
  if (normalizedProviderIp) return normalizedProviderIp

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const candidate = normalizeIpCandidate(forwardedFor.split(',')[0] || '')
    if (candidate) return candidate
  }

  return 'unknown'
}
