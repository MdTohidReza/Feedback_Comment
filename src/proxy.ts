import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
 
export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // Allow unauthenticated users to access public pages like sign-in, sign-up, verify, and root.
    if (!token) {
        if (
            url.pathname.startsWith('/dashboard')
        ) {
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }
        return NextResponse.next()
    }

    // If authenticated, prevent visiting auth pages and send them to dashboard.
    if (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/'
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
}