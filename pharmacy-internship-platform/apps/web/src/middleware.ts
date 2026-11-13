import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Route protection middleware.
 * In Phase 1, this will validate the JWT access token from cookies/headers.
 * For now, it's a stub that protects the structure.
 */

// Routes that require authentication
const PROTECTED_PATTERNS = [
  '/dashboard',
  '/applications',
  '/offers',
  '/placements',
  '/profile',
  '/employer',
];

// Routes only for unauthenticated users (redirect to dashboard if already authed)
const AUTH_ONLY_PATTERNS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtected = PROTECTED_PATTERNS.some((p) => pathname.startsWith(p));

  if (isProtected) {
    // TODO: validate JWT from httpOnly cookie
    // const token = request.cookies.get('access_token')?.value;
    // if (!token) return NextResponse.redirect(new URL('/login', request.url));
    // For now, allow through — auth validation wired in next sprint
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, API routes, and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
