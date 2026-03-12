import { Response } from '@medusajs/medusa-js';
import { useQuery } from '@tanstack/react-query';
import { queryKeysFactory, useMedusa, UseQueryOptionsWrapper } from 'medusa-react';

const ADMIN_CUSTOMER = `admin_customer` as const;
export const adminCustomerKeys = queryKeysFactory(ADMIN_CUSTOMER);
type CustomerQueryKey = typeof adminCustomerKeys;

export const useAdminNextCustomerCode = (
	options?: UseQueryOptionsWrapper<
		Response<{ next_code: string }>,
		Error,
		ReturnType<CustomerQueryKey['detail']>
	>
) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		adminCustomerKeys.detail('next-code'),
		() => client.admin.custom.get('/admin/customer-code'),
		options
	);
	return { nextCode: (data as any)?.next_code as string | undefined, ...rest };
};
