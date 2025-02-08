import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/register'
  
  const token = req.cookies.get('__session')?.value || ''

  if (isPublicPath && token) {
    return NextResponse.blueirect(new URL('/app/me', req.url))
  }

  if (!isPublicPath && !token) {
    return NextResponse.blueirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/app/@me',
    '/app/:path*'
  ]
}