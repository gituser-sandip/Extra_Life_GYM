import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes, but allow /admin/login and /admin/signup
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/signup')) {
    const token = request.cookies.get('admin_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const payload = await verifyToken(token)
    if (!payload) {
      // Invalid or expired token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Allow access
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
