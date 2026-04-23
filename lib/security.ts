import { createHash } from 'crypto'
import { isAdminAuthenticated } from '@/lib/auth'
import { ApiError } from '@/lib/api-error'
import { getClientIp } from '@/lib/http'
import { env } from '@/lib/env'
import { assertTrustedOriginHeaders } from '@/lib/request-guards'
import { checkRateLimit } from '@/lib/rate-limit'

function getAllowedOrigin(request: Request) {
  const preferredOrigin = env.APP_ORIGIN || env.NEXT_PUBLIC_SITE_URL
  if (preferredOrigin) {
    return new URL(preferredOrigin).origin
  }

  const host = request.headers.get('host')
  if (!host) return null
  const protocol = env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${host}`
}

function buildRateLimitIdentity(request: Request) {
  const ip = getClientIp(request)
  const userAgent = request.headers.get('user-agent')?.slice(0, 160) || 'unknown'
  return {
    ip,
    key: `${ip}:${createHash('sha256').update(userAgent).digest('hex').slice(0, 16)}`,
  }
}

export function assertTrustedMutationRequest(request: Request) {
  const allowedOrigin = getAllowedOrigin(request)
  assertTrustedOriginHeaders(request, allowedOrigin)
}

export async function assertAdminRequest(request: Request) {
  assertTrustedMutationRequest(request)
  if (!(await isAdminAuthenticated())) {
    throw new ApiError(401, 'Yetkisiz erisim.')
  }
}

export async function enforceRateLimit(request: Request, keyPrefix: string, limit: number, windowMs: number) {
  const identity = buildRateLimitIdentity(request)
  const rate = await checkRateLimit(`${keyPrefix}:${identity.key}`, { limit, windowMs })

  if (!rate.allowed) {
    throw new ApiError(429, 'Cok fazla istek algilandi. Lutfen biraz sonra tekrar deneyin.')
  }

  return identity.ip
}

export async function enforceIdentifierRateLimit(identifier: string, keyPrefix: string, limit: number, windowMs: number) {
  const normalizedIdentifier = identifier.trim().toLowerCase()
  const identifierFingerprint = createHash('sha256').update(normalizedIdentifier).digest('hex')
  const rate = await checkRateLimit(`${keyPrefix}:${identifierFingerprint}`, { limit, windowMs })

  if (!rate.allowed) {
    throw new ApiError(429, 'Bu islem icin deneme siniri asildi. Lutfen daha sonra tekrar deneyin.')
  }
}

export function fingerprint(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 12)
}
