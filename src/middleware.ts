import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  // ログインページと登録ページへのアクセスは常に許可
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
    return NextResponse.next();
  }

  // トークンがない場合はログインページにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパス
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes that don't require authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 