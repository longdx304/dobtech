'use server';

import { getToken } from '@/actions/auth';
import { createCustomer } from '@/actions/customer';
import { StorePostCustomersReq } from '@medusajs/medusa';
import { revalidateTag } from 'next/cache';

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
    console.log('error', error)
    throw new Error('Lỗi: Email đã tồn tại');
  }
}

export async function logCustomerIn(values: {
  email: string;
  password: string;
}) {
  const { email, password } = values;

  console.log('values', values);
  try {
    await getToken({ email, password }).then(() => {
      console.log('revalidateTag')
      revalidateTag('customer');
    });
  } catch (error: any) {
    console.log('error', error)
    throw new Error('Lỗi: Email hoặc mật khẩu không đúng');
  }
}
