import { NextRequest, NextResponse } from 'next/server';

import {
	AccessPermission,
	getDefaultAdminRoute,
	hasAdminRouteAccess,
	resolvePagePermissions,
} from '@/lib/access-control';
import { ERoutes } from '@/types/routes';
import { ERole } from './types/account';

const PUBLIC_ROUTES = ['/login'];
const ACCESS_DENIED_ROUTE = '/access-denied';

interface CachedUserData {
	role: ERole;
	permissions: string | null;
	page_permissions?: AccessPermission[];
	default_route?: string | null;
}

const VALID_ROLES = new Set<string>(Object.values(ERole));
const VALID_PAGE_PERMISSIONS = new Set<string>(Object.values(AccessPermission));

/**
 * Decodes JWT and checks expiry — no secret needed in Edge Runtime.
 * Signature verification happens at the backend on every API call.
 */
function verifyToken(token: string | undefined): boolean {
	if (!token) return false;
	try {
		const encodedPayload = token.split('.')[1];
		if (!encodedPayload) return false;
		const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
		const paddedBase64 = base64.padEnd(
			base64.length + ((4 - (base64.length % 4)) % 4),
			'='
		);
		const payload = JSON.parse(atob(paddedBase64)) as { exp?: unknown };
		if (
			payload.exp !== undefined &&
			(typeof payload.exp !== 'number' ||
				!Number.isFinite(payload.exp) ||
				payload.exp <= Math.floor(Date.now() / 1000))
		) {
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
		const parsed = JSON.parse(raw) as Record<string, unknown>;
		if (
			!parsed ||
			typeof parsed !== 'object' ||
			typeof parsed.role !== 'string' ||
			!VALID_ROLES.has(parsed.role) ||
			(parsed.permissions !== undefined &&
				parsed.permissions !== null &&
				typeof parsed.permissions !== 'string')
		) {
			return null;
		}

		const pagePermissions = Array.isArray(parsed.page_permissions)
			? parsed.page_permissions.filter(
					(permission): permission is AccessPermission =>
						typeof permission === 'string' &&
						VALID_PAGE_PERMISSIONS.has(permission)
				)
			: undefined;
		const defaultRoute =
			typeof parsed.default_route === 'string' &&
			(parsed.default_route === ERoutes.HOME ||
				parsed.default_route.startsWith(`${ERoutes.HOME}/`))
				? parsed.default_route
				: null;

		return {
			role: parsed.role as ERole,
			permissions:
				typeof parsed.permissions === 'string' ? parsed.permissions : null,
			page_permissions: pagePermissions,
			default_route: defaultRoute,
		};
	} catch {
		return null;
	}
}

/**
 * Checks if the given pathname is a public route
 */
function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTES.includes(pathname) || pathname === ERoutes.LOGIN;
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

export async function middleware(request: NextRequest) {
	try {
		const pathname = request.nextUrl.pathname;

		// Allow public routes without authentication
		if (isPublicRoute(pathname)) {
			return NextResponse.next();
		}

		// Kiot is retired. Keep these routes behind middleware so they cannot
		// become publicly accessible, and send every request to the Admin app.
		if (
			pathname === '/' ||
			pathname === ERoutes.KIOT_HOME ||
			pathname.startsWith(`${ERoutes.KIOT_HOME}/`)
		) {
			return createRedirect(request, ERoutes.HOME);
		}

		// Decode JWT locally — no backend call, no network dependency
		const accessToken = request.cookies.get('_jwt_token_')?.value;
		const isValid = verifyToken(accessToken);

		if (!isValid) {
			return createLoginRedirect(request);
		}

		const userData = getUserData(request);
		if (!userData) {
			return createLoginRedirect(request);
		}

		if (userData.role === ERole.ADMIN) {
			return NextResponse.next();
		}

		const pagePermissions =
			userData.page_permissions ?? resolvePagePermissions(userData);
		if (!hasAdminRouteAccess(pathname, pagePermissions)) {
			return createRedirect(
				request,
				userData.default_route ??
					getDefaultAdminRoute(pagePermissions) ??
					ACCESS_DENIED_ROUTE
			);
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
};
