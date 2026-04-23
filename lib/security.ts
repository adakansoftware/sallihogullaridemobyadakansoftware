import { createHash } from 'crypto'
import { ApiError, getClientIp } from '@/lib/http'
import { isAdminAuthenticated } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { env } from '@/lib/env'

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

function getComparableOrigin(value: string | null) {
  if (!value) return null

  try {
    return new URL(value).origin
  } catch {
    return null
  }
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
  if (!allowedOrigin) return

  const requestOrigin = getComparableOrigin(request.headers.get('origin'))
  const refererOrigin = getComparableOrigin(request.headers.get('referer'))

  if (requestOrigin && requestOrigin !== allowedOrigin) {
    throw new ApiError(403, 'İstek kaynağı doğrulanamadı.')
  }

  if (!requestOrigin && refererOrigin && refererOrigin !== allowedOrigin) {
    throw new ApiError(403, 'İstek kaynağı doğrulanamadı.')
  }
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
    throw new ApiError(429, 'Çok fazla istek algılandı. Lütfen biraz sonra tekrar deneyin.')
  }

  return identity.ip
}

export async function enforceIdentifierRateLimit(identifier: string, keyPrefix: string, limit: number, windowMs: number) {
  const normalizedIdentifier = identifier.trim().toLowerCase()
  const fingerprint = createHash('sha256').update(normalizedIdentifier).digest('hex')
  const rate = await checkRateLimit(`${keyPrefix}:${fingerprint}`, { limit, windowMs })

  if (!rate.allowed) {
    throw new ApiError(429, 'Bu işlem için deneme sınırı aşıldı. Lütfen daha sonra tekrar deneyin.')
  }
}

export function fingerprint(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 12)
}

