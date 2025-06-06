import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import { NextRequest, NextResponse } from 'next/server';

import { ERoutes, routesConfig } from '@/types/routes';
import { ERole } from './types/account';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// Environment variable to control user access paths
const USER_ACCESS_TYPE = process.env.NEXT_PUBLIC_USER_ACCESS_TYPE || 'admin';
const PUBLIC_ROUTES = ['/login'];

interface UserData {
	user: {
		role: ERole;
		permissions: string;
	};
}

/**
 * Fetches user data using the access token
 */
async function fetchUserData(
	accessToken: string | undefined
): Promise<UserData | null> {
	if (!accessToken) return null;

	try {
		const response = await fetch(`${BACKEND_URL}/admin/auth`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return response.json();
	} catch {
		return null;
	}
}

/**
 * Determines the appropriate redirect path based on user access type
 */
function getRedirectPath(): string {
	return USER_ACCESS_TYPE === 'kiot' ? ERoutes.KIOT_HOME : ERoutes.HOME;
}

/**
 * Checks if the given pathname is a public route
 */
function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTES.includes(pathname) || pathname === ERoutes.LOGIN;
}

/**
 * Validates if user has access to the requested path based on environment configuration
 */
function validatePathAccess(pathname: string): boolean {
	if (!USER_ACCESS_TYPE || isPublicRoute(pathname)) {
		return true;
	}

	const pathAccessMap = {
		kiot: pathname.startsWith('/kiot/') || pathname === '/kiot',
		admin: pathname.startsWith('/admin/') || pathname === '/admin',
	};

	return pathAccessMap[USER_ACCESS_TYPE as keyof typeof pathAccessMap] ?? true;
}

/**
 * Checks if user has required permissions for the current route
 */
function hasRoutePermissions(
	pathname: string,
	userPermissions: string
): boolean {
	const routeConfig = routesConfig.find((route) =>
		pathname.startsWith(route.path)
	);

	if (!routeConfig?.mode || routeConfig.mode.length === 0) {
		return false;
	}

	const userPermissionsList = userPermissions.split(',');
	const requiredPermissions = intersection(
		routeConfig.mode,
		userPermissionsList
	);

	return !isEmpty(requiredPermissions);
}

/**
 * Creates a redirect response to the specified path
 */
function createRedirect(request: NextRequest, path: string): NextResponse {
	return NextResponse.redirect(new URL(path, request.url), 307);
}

export async function middleware(request: NextRequest) {
	try {
		const pathname = request.nextUrl.pathname;

		// Check environment-based path access restrictions
		if (!validatePathAccess(pathname)) {
			return createRedirect(request, getRedirectPath());
		}

		// Allow public routes without authentication
		if (isPublicRoute(pathname)) {
			return NextResponse.next();
		}

		// Authenticate user
		const accessToken = request.cookies.get('_jwt_token_')?.value;
		const userData = await fetchUserData(accessToken);

		// Redirect to login if user is not authenticated
		if (isEmpty(userData)) {
			return createRedirect(request, ERoutes.LOGIN);
		}

		const { role, permissions } = userData.user;

		// Admin users have full access
		if (role === ERole.ADMIN) {
			return NextResponse.next();
		}

		// Check route-specific permissions
		if (!hasRoutePermissions(pathname, permissions)) {
			return createRedirect(request, getRedirectPath());
		}

		return NextResponse.next();
	} catch (error) {
		console.error('Middleware error:', error);
		return createRedirect(request, ERoutes.LOGIN);
	}
}

export const config = {
	matcher: ['/', '/admin/:path*', '/kiot/:path*', '/login'],
	runtime: 'experimental-edge',
	unstable_allowDynamic: ['**/node_modules/lodash*/**/*.js'],
};
