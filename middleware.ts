// middleware.ts
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Update session and handle auth
  const response = await updateSession(request);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /api (API routes)
     * - /auth (auth routes)
     * - /login (login page)
     * - /signup (signup page)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|auth|login|signup).*)',
  ],
};