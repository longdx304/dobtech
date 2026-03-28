'use server';

import { cookies } from 'next/headers';

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

export async function setUserData(role: string, permissions: string | null) {
	cookies().set('_user_data_', JSON.stringify({ role, permissions }), {
		maxAge: 60 * 60 * 24 * 7,
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
	});
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
