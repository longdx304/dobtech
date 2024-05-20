import _ from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

import { ERoutes, routesConfig } from '@/types/routes';
import { ERole } from './types/account';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
// const BACKEND_URL = 'http://13.213.42.237:9000';

async function getUser(accessToken: string | undefined) {
	if (accessToken) {
		return fetch(`${BACKEND_URL}/admin/auth`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((data) => data.json())
			.catch(() => null);
	}
	return null;
}

const publicRoutes = ['/login'];

export async function middleware(request: NextRequest) {
	const res = NextResponse.next();
	// Get pathname of current routes
	const pathname = request.nextUrl.pathname;
	const isPublicRoute = publicRoutes.includes(pathname);

	// Decrypt the session from the cookie
	const accessToken = request.cookies.get('_medusa_jwt')?.value;
	// Get current user information
	const data = await getUser(accessToken);

	// If route is public, program executing
	if (isPublicRoute || pathname === ERoutes.LOGIN) {
		if (!_.isEmpty(data)) {
			return NextResponse.redirect(
				new URL(ERoutes.DASHBOARD, request.url),
				307
			);
		}
		return res;
	}

	// Redirect Login page if user hasn't logged in
	if (_.isEmpty(data)) {
		return NextResponse.redirect(new URL(ERoutes.LOGIN, request.url), 307);
	}

	const { role, permissions } = data.user;

	// If user has role admin, program executing
	if (role === ERole.ADMIN) {
		return res;
	}
	// Find mode of routes
	const { mode: routesMode } =
		routesConfig.find((routes) => pathname.startsWith(routes.path)) ?? {};

	// Routes mode isn't exists program executing
	if (!routesMode || routesMode?.length === 0) {
		return res;
	}

	// Check current user has permission into routes
	const hasPermissions = _.intersection(routesMode, permissions?.split(','));

	// If user hasn't permission return homepage
	if (_.isEmpty(hasPermissions)) {
		return NextResponse.redirect(new URL(ERoutes.DASHBOARD, request.url), 307);
	}

	return res;
}

export const config = {
	// matcher: [
	// 	'/((?!api|_next/static|favicon.ico|manifest.json|sw*|workbox-*|ios*|.*\\.png$|.*\\.jpg$).*)',
	// ],
	matcher: ['/admin/:path*', '/login'],
	runtime: 'experimental-edge',
	unstable_allowDynamic: ['**/node_modules/lodash*/**/*.js'],
};
