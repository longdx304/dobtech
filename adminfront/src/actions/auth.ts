'use server';

import { cookies } from 'next/headers';
import { AccessPermission } from '@/lib/access-control';

export async function setCookie(access_token: any) {
	access_token &&
		cookies().set('_jwt_token_', access_token, {
			maxAge: 60 * 60 * 24 * 7,
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
		});
	return [];
}

export async function setUserData(
	role: string,
	permissions: string | null,
	pagePermissions?: AccessPermission[],
	defaultRoute?: string | null
) {
	cookies().set(
		'_user_data_',
		JSON.stringify({
			role,
			permissions,
			page_permissions: pagePermissions,
			default_route: defaultRoute,
		}),
		{
			maxAge: 60 * 60 * 24 * 7,
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
		}
	);
	return [];
}

export async function removeCookie() {
	cookies().set('_jwt_token_', '', {
		maxAge: -1,
	});
	cookies().set('_user_data_', '', {
		maxAge: -1,
	});
	return [];
}
