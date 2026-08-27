import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication here
const protectedPaths = [
  '/dashboard',
  '/onboarding'
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path is in the protected list
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  if (isProtectedPath) {
    // Check for the session cookie defined in our auth service
    const session = request.cookies.get('launchpad_session')
    
    if (!session) {
      // If not authenticated, redirect to the register/login screen
      const url = request.nextUrl.clone()
      url.pathname = '/register'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Ensure the middleware only runs on routes we care about
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
