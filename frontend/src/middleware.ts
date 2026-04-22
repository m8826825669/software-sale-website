import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/dashboard', '/admin', '/checkout']
const AUTH_ONLY  = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for access token in cookies (set during login for SSR support)
  const token = request.cookies.get('access_token')?.value

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  const isAuthPage  = AUTH_ONLY.some(p => pathname.startsWith(p))

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login/register
  if (isAuthPage && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/checkout/:path*', '/auth/:path*'],
}
