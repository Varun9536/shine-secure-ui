import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');

  if (pathname === '/admin/login' && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
