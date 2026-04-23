import { cookies } from 'next/headers'
import { normalizeAdminNextTarget } from '@/lib/admin-redirect'
import { env } from '@/lib/env'
import { createSignedAdminSessionToken, isValidSignedAdminSessionToken } from '@/lib/session-token'

export const ADMIN_COOKIE = 'admin_session'

const SESSION_MAX_AGE = 60 * 60 * 8

import crypto from 'crypto'

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function createSessionToken() {
  return createSignedAdminSessionToken(env.ADMIN_SESSION_SECRET, SESSION_MAX_AGE)
}

export function isValidAdminSessionToken(token: string | undefined) {
  return isValidSignedAdminSessionToken(token, env.ADMIN_SESSION_SECRET)
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

export { normalizeAdminNextTarget }
