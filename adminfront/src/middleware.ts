import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import { decodeJwt } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

import { hasAdminRouteAccess } from '@/lib/access-control';
import {
	AdminAccessProfileResult,
	classifyAdminAccessProfileStatus,
} from '@/lib/admin-access-profile';
import { ERoutes, routesConfig } from '@/types/routes';
import { ERole } from './types/account';

// Environment variable to control user access paths
const USER_ACCESS_TYPE = process.env.NEXT_PUBLIC_USER_ACCESS_TYPE || 'admin';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9000';
const PUBLIC_ROUTES = ['/login'];
const ACCESS_DENIED_ROUTE = '/access-denied';

interface CachedUserData {
	role: ERole;
	permissions: string;
}

/**
 * Decodes JWT and checks expiry — no secret needed in Edge Runtime.
 * Signature verification happens at the backend on every API call.
 */
function verifyToken(token: string | undefined): boolean {
	if (!token) return false;
	try {
		const payload = decodeJwt(token);
		if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
			return false; // token expired
		}
		return true;
	} catch {
		return false;
	}
}

/**
 * Reads cached user role/permissions from cookie set at login time
 */
function getUserData(request: NextRequest): CachedUserData | null {
	const raw = request.cookies.get('_user_data_')?.value;
	if (!raw) return null;
	try {
		return JSON.parse(raw) as CachedUserData;
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

function createLoginRedirect(request: NextRequest): NextResponse {
	const response = createRedirect(request, ERoutes.LOGIN);
	response.cookies.delete('_jwt_token_');
	response.cookies.delete('_user_data_');
	return response;
}

async function getAdminAccessProfile(
	accessToken: string
): Promise<AdminAccessProfileResult> {
	const response = await fetch(`${BACKEND_URL}/admin/me/access`, {
		headers: { Authorization: `Bearer ${accessToken}` },
		cache: 'no-store',
	});
	if (!response.ok) {
		return { type: classifyAdminAccessProfileStatus(response.status) };
	}
	return { type: 'ok', profile: await response.json() };
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

		// Decode JWT locally — no backend call, no network dependency
		const accessToken = request.cookies.get('_jwt_token_')?.value;
		const isValid = verifyToken(accessToken);

		if (!isValid) {
			return createLoginRedirect(request);
		}

		if (pathname === ERoutes.HOME || pathname.startsWith(`${ERoutes.HOME}/`)) {
			const accessProfileResult = await getAdminAccessProfile(accessToken!);
			if (accessProfileResult.type === 'auth_failed') {
				return createLoginRedirect(request);
			}
			if (accessProfileResult.type === 'unavailable') {
				return createRedirect(request, ACCESS_DENIED_ROUTE);
			}
			const { profile: accessProfile } = accessProfileResult;
			if (accessProfile.role === ERole.ADMIN) {
				return NextResponse.next();
			}
			if (!hasAdminRouteAccess(pathname, accessProfile.page_permissions)) {
				return createRedirect(
					request,
					accessProfile.default_route ?? ACCESS_DENIED_ROUTE
				);
			}
			return NextResponse.next();
		}

		// Read user role/permissions from cookie cached at login time
		const userData = getUserData(request);

		if (!userData) {
			return createLoginRedirect(request);
		}

		const { role, permissions } = userData;

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
