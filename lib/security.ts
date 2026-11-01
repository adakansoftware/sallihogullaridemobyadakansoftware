import { createHash } from 'crypto'
import { isAdminAuthenticated } from '@/lib/auth'
import { ApiError } from '@/lib/api-error'
import { getClientIp } from '@/lib/client-ip'
import { env } from '@/lib/env'
import { resolveAllowedOrigin } from '@/lib/origin'
import { assertTrustedOriginHeaders } from '@/lib/request-guards'
import { checkRateLimit } from '@/lib/rate-limit'

function getAllowedOrigin(request: Request) {
  return resolveAllowedOrigin({
    appOrigin: env.APP_ORIGIN,
    publicSiteUrl: env.NEXT_PUBLIC_SITE_URL,
    nodeEnv: env.NODE_ENV,
    hostHeader: request.headers.get('host'),
  })
}

function buildRateLimitIdentity(request: Request) {
  const ip = getClientIp(request)
  return {
    ip,
    // User-Agent is attacker-controlled and rotating it must not reset a limit.
    key: ip,
  }
}

export function assertTrustedMutationRequest(request: Request) {
  const allowedOrigin = getAllowedOrigin(request)
  assertTrustedOriginHeaders(request, allowedOrigin)
}

export async function assertAdminRequest(request: Request) {
  assertTrustedMutationRequest(request)
  if (!(await isAdminAuthenticated())) {
    throw new ApiError(401, 'Yetkisiz erişim.')
  }
}

export async function enforceRateLimit(request: Request, keyPrefix: string, limit: number, windowMs: number) {
  const identity = buildRateLimitIdentity(request)
  const rate = await checkRateLimit(`${keyPrefix}:${identity.key}`, { limit, windowMs })

  if (!rate.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000))
    throw new ApiError(
      429,
      'Çok fazla istek algılandı. Lütfen biraz sonra tekrar deneyin.',
      { 'Retry-After': String(retryAfterSeconds) },
    )
  }

  return identity.ip
}

export async function enforceIdentifierRateLimit(identifier: string, keyPrefix: string, limit: number, windowMs: number) {
  const normalizedIdentifier = identifier.trim().toLowerCase()
  const identifierFingerprint = createHash('sha256').update(normalizedIdentifier).digest('hex')
  const rate = await checkRateLimit(`${keyPrefix}:${identifierFingerprint}`, { limit, windowMs })

  if (!rate.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000))
    throw new ApiError(
      429,
      'Bu işlem için deneme sınırı aşıldı. Lütfen daha sonra tekrar deneyin.',
      { 'Retry-After': String(retryAfterSeconds) },
    )
  }
}

export function fingerprint(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 12)
}
