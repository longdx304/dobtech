/** @jest-environment node */

import { NextRequest } from 'next/server';

import { AccessPermission } from '@/lib/access-control';
import { middleware } from '@/middleware';

function jwt(exp: number): string {
	const encode = (value: object) =>
		Buffer.from(JSON.stringify(value)).toString('base64url');
	return `${encode({ alg: 'none', typ: 'JWT' })}.${encode({ exp })}.signature`;
}

function request(
	pathname: string,
	options?: {
		token?: string;
		userData?: unknown;
	}
): NextRequest {
	const result = new NextRequest(
		`https://staging-admin.chamdep.com${pathname}`
	);
	if (options?.token) {
		result.cookies.set('_jwt_token_', options.token);
	}
	if (options && 'userData' in options) {
		result.cookies.set('_user_data_', JSON.stringify(options.userData));
	}
	return result;
}

const validToken = () => jwt(Math.floor(Date.now() / 1000) + 3600);

describe('admin middleware', () => {
	it('allows the public login route without cookies', async () => {
		const response = await middleware(request('/login'));
		expect(response.headers.get('x-middleware-next')).toBe('1');
	});

	it('redirects root and retired Kiot routes to Admin', async () => {
		for (const pathname of ['/', '/kiot', '/kiot/accounts']) {
			const response = await middleware(request(pathname));
			expect(response.status).toBe(307);
			expect(response.headers.get('location')).toBe(
				'https://staging-admin.chamdep.com/admin'
			);
		}
	});

	it('redirects missing, expired, or malformed authentication to login', async () => {
		const cases = [
			request('/admin/orders'),
			request('/admin/orders', {
				token: jwt(Math.floor(Date.now() / 1000) - 1),
				userData: { role: 'admin', permissions: null },
			}),
			request('/admin/orders', {
				token: validToken(),
				userData: { role: 123, page_permissions: 'broken' },
			}),
		];

		for (const currentRequest of cases) {
			const response = await middleware(currentRequest);
			expect(response.status).toBe(307);
			expect(response.headers.get('location')).toBe(
				'https://staging-admin.chamdep.com/login'
			);
		}
	});

	it('allows an authenticated admin without a network request', async () => {
		const response = await middleware(
			request('/admin/orders/order_123', {
				token: validToken(),
				userData: { role: 'admin', permissions: null },
			})
		);
		expect(response.headers.get('x-middleware-next')).toBe('1');
	});

	it('enforces cached page permissions for members', async () => {
		const userData = {
			role: 'member',
			permissions: 'sale',
			page_permissions: [AccessPermission.SalesOrders],
			default_route: '/admin/orders',
		};
		const allowed = await middleware(
			request('/admin/orders/order_123', {
				token: validToken(),
				userData,
			})
		);
		const denied = await middleware(
			request('/admin/regions', { token: validToken(), userData })
		);

		expect(allowed.headers.get('x-middleware-next')).toBe('1');
		expect(denied.status).toBe(307);
		expect(denied.headers.get('location')).toBe(
			'https://staging-admin.chamdep.com/admin/orders'
		);
	});
});
