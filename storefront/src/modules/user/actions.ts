'use server';

import { authenticate, getToken } from '@/actions/auth';
import {
	addShippingAddress,
	createCustomer,
	deleteShippingAddress,
	updateCustomer,
	updateShippingAddress,
} from '@/actions/customer';
import { AddressProps } from '@/modules/common/components/address-form';
import {
	Customer,
	StorePostCustomersCustomerAddressesAddressReq,
	StorePostCustomersCustomerAddressesReq,
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

export async function updateCustomerName(values: {
	firstName: string;
	lastName: string;
}) {
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

export async function updateCustomerPhone(values: { phone: string }) {
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
	values: {
		old_password: string;
		new_password: string;
		confirm_password: string;
	}
) {
	const email = customer.email;
	const new_password = values.new_password as string;
	const old_password = values.old_password as string;
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

export async function addCustomerShippingAddress(values: AddressProps) {
	const customer = {
		address: {
			first_name: values.firstName,
			last_name: values.lastName,
			phone: values.phone,
			address_1: values.ward,
			address_2: values.address,
			city: values.district,
			province: values.province,
			postal_code: values.postalCode,
			country_code: values.countryCode,
		},
	} as StorePostCustomersCustomerAddressesReq;

	try {
		await addShippingAddress(customer).then(() => {
			revalidateTag('customer');
		});
		return { success: true, error: null };
	} catch (error: any) {
		return { success: false, error: error.toString() };
	}
}

export async function updateCustomerShippingAddress(
	addressId: string,
	value: AddressProps
) {
	const address = {
		first_name: value.firstName,
		last_name: value.lastName,
		phone: value.phone,
		address_1: value.ward,
		address_2: value.address,
		city: value.district,
		province: value.province,
		postal_code: value.postalCode,
		country_code: value.countryCode,
	} as StorePostCustomersCustomerAddressesAddressReq;

	try {
		await updateShippingAddress(addressId, address).then(() => {
			revalidateTag('customer');
		});
		return { success: true, error: null, addressId };
	} catch (error: any) {
		return { success: false, error: error.toString(), addressId };
	}
}

export async function deleteCustomerShippingAddress(addressId: string) {
	try {
		await deleteShippingAddress(addressId).then(() => {
			revalidateTag('customer');
		});
		return { success: true, error: null };
	} catch (error: any) {
		return { success: false, error: error.toString() };
	}
}

export async function signOut() {
	cookies().set('_chamdep_jwt', '', {
		maxAge: -1,
	});
	revalidateTag('auth');
	revalidateTag('customer');
}
