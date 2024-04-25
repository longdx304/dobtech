import _ from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

import { ERole } from '@/types/account';
import { routesConfig } from '@/types/routes';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

async function getUser(accessToken: any) {
	if (accessToken) {
		return fetch(`${BACKEND_URL}/admin/auth`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}).then((data) => data.json());
	}
	return null;
}
export async function middleware(request: NextRequest) {
	const res = NextResponse.next();
	const accessToken = request.cookies.get('_medusa_jwt')?.value;

	// Get current user information
	const data = await getUser(accessToken);

	// User not found return homepage
	if (!data) {
		return NextResponse.redirect(new URL('/', request.url), 307);
	}

	const { role, permissions } = data.user;

	// If user has role admin, program executing
	if (role === ERole.ADMIN) {
		return res;
	}
	// Get pathname of current routes
	const pathname = request.nextUrl.pathname;
	// Find mode of routes
	const { mode: routesMode } =
		routesConfig.find((routes) => routes.path === pathname) || {};

	// Routes mode isn't exists return homepage
	if (!routesMode) {
		return NextResponse.redirect(new URL('/', request.url), 307);
	}

	// Check current user has permission into routes
	const hasPermissions = _.intersection(routesMode, permissions.split(','));

	// If user hasn't permission return homepage
	if (_.isEmpty(hasPermissions)) {
		return NextResponse.redirect(new URL('/', request.url), 307);
	}

	return res;
}

export const config = {
	matcher: ['/accounts/:path', '/products/:path'],
	runtime: 'experimental-edge',
	unstable_allowDynamic: [
		'**/node_modules/lodash*/**/*.js',
	],
};
