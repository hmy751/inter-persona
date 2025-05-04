import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // /health 경로에 대한 요청 처리
  if (request.nextUrl.pathname === '/health') {
    return new NextResponse('OK', { status: 200 });
  }

  // 다른 요청은 다음 단계로 전달
  return NextResponse.next();
}

// /health 경로에만 미들웨어 적용
export const config = {
  matcher: '/health',
};
