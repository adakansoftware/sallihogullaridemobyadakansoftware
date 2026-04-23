import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, isValidAdminSessionToken } from '@/lib/auth'

function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const token = request.cookies.get(ADMIN_COOKIE)?.value
  const hasToken = Boolean(token)
  const isAuthenticated = isValidAdminSessionToken(token)

  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    const response = NextResponse.next()
    return hasToken ? clearAdminCookie(response) : response
  }

  if (isAuthenticated) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('next', pathname)
  const response = NextResponse.redirect(loginUrl)
  return hasToken ? clearAdminCookie(response) : response
}

export const config = {
  matcher: ['/admin/:path*'],
}
