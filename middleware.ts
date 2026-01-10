import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const isPublicPath = 
    pathname.startsWith('/auth') || 
    pathname.startsWith('/offline') || 
    pathname.startsWith('/api/auth');
  if (accessToken && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Mencocokkan semua request path kecuali:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (icons, fonts, manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icons|fonts|manifest.json).*)',
  ],
};