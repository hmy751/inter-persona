import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 제외할 파일 확장자들
const FILE_EXTENSIONS = /\.(js|css|map|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/;

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/health') {
    return new NextResponse('OK', { status: 200 });
  }

  const token = request.cookies.get('token');

  const path = request.nextUrl.pathname;
  const { origin } = request.nextUrl;

  // _next 경로이거나 특정 파일 확장자를 포함하는 경로는 무시
  if (path.startsWith('/_next/') || FILE_EXTENSIONS.test(path)) {
    return NextResponse.next();
  }

  if (token) {
    if (path === '/main') {
      return NextResponse.redirect(new URL('/interviewer', origin));
    }
  } else {
    if (path !== '/main') {
      return NextResponse.redirect(new URL('/main', origin));
    }
  }

  return NextResponse.next();
}
