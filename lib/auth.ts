import crypto from 'crypto'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

export const ADMIN_COOKIE = 'admin_session'

const SESSION_MAX_AGE = 60 * 60 * 8

type SessionPayload = {
  sub: 'admin'
  exp: number
  iat: number
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function sign(value: string) {
  return crypto.createHmac('sha256', env.ADMIN_SESSION_SECRET).update(value).digest('base64url')
}

function createSessionToken() {
  const now = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = {
    sub: 'admin',
    iat: now,
    exp: now + SESSION_MAX_AGE,
  }

  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  return `${encodedPayload}.${sign(encodedPayload)}`
}

export function isValidAdminSessionToken(token: string | undefined) {
  if (!token) return false

  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return false
  if (!safeEqual(sign(encodedPayload), signature)) return false

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload
    const now = Math.floor(Date.now() / 1000)
    return payload.sub === 'admin' && payload.iat <= now && payload.exp > now
  } catch {
    return false
  }
}

function getSessionCookieConfig(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: env.NODE_ENV === 'production',
    path: '/',
    priority: 'high' as const,
    maxAge,
  }
}

export async function setAdminSession() {
  const store = await cookies()
  store.set(ADMIN_COOKIE, createSessionToken(), getSessionCookieConfig(SESSION_MAX_AGE))
}

export async function clearAdminSession() {
  const store = await cookies()
  store.set(ADMIN_COOKIE, '', getSessionCookieConfig(0))
}

export async function isAdminAuthenticated() {
  const store = await cookies()
  return isValidAdminSessionToken(store.get(ADMIN_COOKIE)?.value)
}

export function validateAdminCredentials(email: string, password: string) {
  return safeEqual(email.trim().toLowerCase(), env.ADMIN_EMAIL.toLowerCase()) && safeEqual(password, env.ADMIN_PASSWORD)
}

export function normalizeAdminNextTarget(value: string | null | undefined) {
  if (!value) return '/admin'
  if (!value.startsWith('/admin')) return '/admin'
  if (value.startsWith('//')) return '/admin'
  if (value.includes('://')) return '/admin'
  if (/[\r\n]/.test(value)) return '/admin'

  const [pathname] = value.split('?')
  if (!pathname || !/^\/admin(?:\/[\w-]+)*$/.test(pathname)) {
    return '/admin'
  }

  return value
}

