import { NextRequest, NextResponse, userAgent } from 'next/server';
import { ERoutes } from './types/routes';
import { BACKEND_URL } from '@/lib/constants';

async function getUser(accessToken: string | undefined) {
	if (accessToken) {
		return fetch(`${BACKEND_URL}/store/auth`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((data) => data.json())
			.catch(() => null);
	}
	return null;
}

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
  const accessToken = request.cookies.get('_medusa_jwt')?.value;
	const data = await getUser(accessToken);
	console.log('accessToken', data)

  if (device.type === 'mobile') {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    if (accessToken && pathname === `/${ERoutes.AUTH}`) {
      return NextResponse.redirect(new URL(`/${ERoutes.USER}`, request.url));
    } else if (!accessToken && pathname === `/${ERoutes.USER}`) {
      return NextResponse.redirect(new URL(`/${ERoutes.AUTH}`, request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};
