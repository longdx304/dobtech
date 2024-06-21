import { NextRequest, NextResponse, userAgent } from 'next/server';
import { ERoutes } from './types/routes';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-origin', origin);

  // Check if user is authenticated
  const { device } = userAgent(request);
  const isUserAuthenticated = request.cookies.get('_medusa_jwt');

  if (device.type === 'mobile') {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    if (isUserAuthenticated && pathname === `/${ERoutes.AUTH}`) {
      return NextResponse.redirect(new URL(`/${ERoutes.USER}`, request.url));
    } else if (!isUserAuthenticated && pathname === `/${ERoutes.USER}`) {
      return NextResponse.redirect(new URL(`/${ERoutes.AUTH}`, request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};
