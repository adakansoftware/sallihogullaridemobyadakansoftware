import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { ApiError } from '@/lib/api-error'

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init)
}

export function jsonNoStore<T>(data: T, init?: ResponseInit) {
  const headers = new Headers(init?.headers)
  headers.set('Cache-Control', 'no-store, max-age=0')
  return NextResponse.json(data, { ...init, headers })
}

export function jsonError(status: number, message: string, init?: ResponseInit) {
  return NextResponse.json({ message }, { status, ...init })
}

function normalizeIpCandidate(value: string) {
  const normalized = value.trim().replace(/^\[|\]$/g, '')
  if (!normalized) return null
  if (normalized.length > 120) return null
  if (!/^[a-fA-F0-9:.\-]+$/.test(normalized)) return null
  return normalized
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const candidate = normalizeIpCandidate(forwardedFor.split(',')[0] || '')
    if (candidate) return candidate
  }

  const realIp = request.headers.get('x-real-ip')
  const normalizedRealIp = realIp ? normalizeIpCandidate(realIp) : null
  return normalizedRealIp || 'unknown'
}

export async function readJson<T>(request: Request, parser: { parse: (value: unknown) => T }): Promise<T> {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new ApiError(415, 'İstek içeriği JSON olmalıdır.')
  }

  const body = await request.json().catch(() => {
    throw new ApiError(400, 'Geçersiz istek verisi.')
  })

  try {
    return parser.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(400, error.issues[0]?.message || 'Girilen veriler geçersiz.')
    }
    throw error
  }
}

export function withErrorHandling(handler: () => Promise<NextResponse>) {
  return handler().catch((error) => {
    if (error instanceof ApiError) {
      return jsonError(error.status, error.exposeMessage)
    }

    return jsonError(500, 'İşlem şu anda tamamlanamadı.')
  })
}

export { ApiError }
