// Authentication actions
import { medusaClient } from '@/lib/database/config';
import { cookies } from 'next/headers';
import { getMedusaHeaders } from './common';

export async function getToken(credentials: any) {
	return medusaClient.admin.auth
		.getToken(credentials, {
			next: {
				tags: ['auth'],
			},
		})
		.then(({ access_token }) => {
			access_token &&
				cookies().set('_medusa_jwt', access_token, {
					maxAge: 60 * 60 * 24 * 7,
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
				});
			return access_token;
		});
}

export async function getAdmin() {
	const headers = getMedusaHeaders(['auth']);

	return medusaClient.admin.auth.getSession(headers).then(({ user }) => user);
}
