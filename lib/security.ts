import { createHash } from 'crypto'
import { isAdminAuthenticated } from '@/lib/auth'
import { ApiError, getClientIp } from '@/lib/http'
import { env } from '@/lib/env'
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

function getComparableOrigin(value: string | null) {
  if (!value) return null

  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

function hasMatchingOrigin(origin: string | null, allowedOrigin: string) {
  return !origin || origin === allowedOrigin
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

  if (!requestOrigin && !refererOrigin) {
    throw new ApiError(403, 'Istek kaynagi dogrulanamadi.')
  }

  if (!hasMatchingOrigin(requestOrigin, allowedOrigin) || !hasMatchingOrigin(refererOrigin, allowedOrigin)) {
    throw new ApiError(403, 'Istek kaynagi dogrulanamadi.')
  }
}

export function assertRequestContentType(request: Request, allowedContentTypes: string[]) {
  const contentType = request.headers.get('content-type')?.toLowerCase() || ''
  if (!allowedContentTypes.some((value) => contentType.includes(value))) {
    throw new ApiError(415, 'Istek icerigi beklenen formatta degil.')
  }
}

export function assertRequestBodySize(request: Request, maxBytes: number) {
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new ApiError(413, 'Istek boyutu siniri asildi.')
  }
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
