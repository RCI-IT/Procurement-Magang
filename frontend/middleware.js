import { NextResponse } from 'next/server';

/** @param {import('next/server').NextRequest} request */
export function middleware(request) {
  const token = request.cookies.get('refreshToken')?.value;
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ['/login', '/register'];

  const isPublic = publicRoutes.includes(pathname);

  // Jika bukan halaman publik dan tidak ada token, redirect ke /login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Terapkan middleware ke semua route kecuali static/api
export const config = {
  matcher: ['/((?!_next|static|favicon.ico|api).*)'],
};
