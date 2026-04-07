import { buildOptions } from '@/utils/build-options';
import { AddressCreatePayload, Customer } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { adminCustomerKeys, useMedusa } from 'medusa-react';

const customerListInvalidateKeys = (customerId: string) =>
	[adminCustomerKeys.detail(customerId), adminCustomerKeys.lists()] as const;

export const useAdminAddCustomerAddress = (
	customerId: string,
	options?: UseMutationOptions<Response<Customer>, Error, AddressCreatePayload>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AddressCreatePayload) =>
			client.admin.custom.post(
				`/admin/customers/${customerId}/address`,
				payload
			),
		buildOptions(
			queryClient,
			[...customerListInvalidateKeys(customerId)],
			options
		)
	);
};

export type AdminUpdateCustomerAddressPayload = Partial<
	Omit<AddressCreatePayload, 'customer_id'>
>;

export type AdminUpdateCustomerAddressVariables = {
	addressId: string;
	payload: AdminUpdateCustomerAddressPayload;
};

export const useAdminUpdateCustomerAddress = (
	customerId: string,
	options?: UseMutationOptions<
		Response<Customer>,
		Error,
		AdminUpdateCustomerAddressVariables
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ addressId, payload }: AdminUpdateCustomerAddressVariables) =>
			client.admin.custom.post(
				`/admin/customers/${customerId}/address/${addressId}`,
				payload
			),
		buildOptions(
			queryClient,
			[...customerListInvalidateKeys(customerId)],
			options
		)
	);
};

export const useAdminDeleteCustomerAddress = (
	customerId: string,
	options?: UseMutationOptions<Response<Customer>, Error, string>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(addressId: string) =>
			client.admin.custom.delete(
				`/admin/customers/${customerId}/address/${addressId}`
			),
		buildOptions(
			queryClient,
			[...customerListInvalidateKeys(customerId)],
			options
		)
	);
};
