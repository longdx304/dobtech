"use server";

// Authentication actions
import { medusaClient } from '@/lib/database/config';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

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
	const headers = await getMedusaHeaders(['auth']);
	console.log("headers:", headers)

	return medusaClient.admin.auth.getSession(headers).then(({ user }) => user);
}


export async function signOut() {
  cookies().set("_medusa_jwt", "", {
    maxAge: -1,
  })
  // const nextUrl = headers().get("next-url")
  // const countryCode = nextUrl?.split("/")[1] || ""
  revalidateTag("auth")
  revalidateTag("admin")
	redirect(`/`)
  // if (nextUrl) {
  //   redirect(`/${countryCode}/account`)
  // }
}