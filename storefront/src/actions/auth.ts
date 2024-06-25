"use server"
import { medusaClient } from '@/lib/database/config';
import medusaError from '@/lib/utils/medusa-error';
import { StorePostAuthReq } from '@medusajs/medusa';
import { cookies } from 'next/headers';

/**
 * Function for getting custom headers for Medusa API requests, including the JWT token and cache revalidation tags.
 *
 * @param tags
 * @returns custom headers for Medusa API requests
 */
export const getMedusaHeaders = (tags: string[] = []) => {
  const headers = {
    next: {
      tags,
    },
  } as Record<string, any>;

  const token = cookies().get('_medusa_jwt')?.value;

  if (token) {
    headers.authorization = `Bearer ${token}`;
  } else {
    headers.authorization = '';
  }

  return headers;
};

// Authentication actions
export async function getToken(credentials: StorePostAuthReq) {
  return medusaClient.auth
    .getToken(credentials, {
      next: {
        tags: ["auth"],
      },
    })
    .then(({ access_token }) => {
      access_token &&
        cookies().set("_medusa_jwt", access_token, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        })
      return access_token
    })
    .catch((err) => {
      throw new Error("Lỗi: Email hoặc mật khẩu không đúng")
    })
}

export async function authenticate(credentials: StorePostAuthReq) {
  const headers = getMedusaHeaders(["auth"])

  return medusaClient.auth
    .authenticate(credentials, headers)
    .then(({ customer }) => customer)
    .catch((err) => medusaError(err))
}