'use server';

import { authenticate, getToken } from '@/actions/auth';
import { createCustomer, updateCustomer } from '@/actions/customer';
import {
  Customer,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
} from '@medusajs/medusa';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function signUp(values: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const customer = {
    email: values.email,
    password: values.password,
    first_name: values.firstName,
    last_name: values.lastName,
    phone: values.phone,
  } as StorePostCustomersReq;

  try {
    await createCustomer(customer);
    await getToken({ email: customer.email, password: customer.password }).then(
      () => {
        revalidateTag('customer');
      }
    );
  } catch (error: any) {
    console.log('error', error);
    throw new Error('Lỗi: Email đã tồn tại');
  }
}

export async function logCustomerIn(values: {
  email: string;
  password: string;
}) {
  const { email, password } = values;

  try {
    await getToken({ email, password }).then(() => {
      revalidateTag('customer');
    });
  } catch (error: any) {
    console.log('error', error);
    throw new Error('Lỗi: Email hoặc mật khẩu không đúng');
  }
}

export async function updateCustomerName(values: any) {
  const customer = {
    first_name: values.firstName,
    last_name: values.lastName,
  } as StorePostCustomersCustomerReq;

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerEmail(values: { email: string }) {
  const customer = {
    email: values.email,
  } as StorePostCustomersCustomerReq;

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerPhone(values: any) {
  const customer = {
    phone: values.phone,
  } as StorePostCustomersCustomerReq;

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerPassword(
  customer: Omit<Customer, 'password_hash'>,
  values: any
) {
  const email = customer.email;
  const new_password = values.new_password as string;
  const old_password = values.oke_password as string;
  const confirm_password = values.confirm_password as string;

  const isValid = await authenticate({ email, password: old_password })
    .then(() => true)
    .catch(() => false);

  if (!isValid) {
    throw new Error('Mật khẩu cũ không đúng');
  }

  if (new_password !== confirm_password) {
    throw new Error('Mật khẩu mới không khớp');
  }

  try {
    await updateCustomer({ password: new_password }).then(() => {
      revalidateTag('customer');
    });

    return {
      success: true,
      error: null,
    };
  } catch (error: any) {
    throw new Error(error.toString());
  }
}

export async function signOut() {
  cookies().set("_medusa_jwt", "", {
    maxAge: -1,
  })
  revalidateTag("auth")
  revalidateTag("customer")
}