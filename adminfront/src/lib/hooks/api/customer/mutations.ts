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

/** Pass `customerId` at call time so the URL never becomes `/admin/customers//address` (that can normalize to `/admin/customers/address` and hit the wrong Medusa route). */
export type AdminAddCustomerAddressVariables = {
	customerId: string;
	payload: AddressCreatePayload;
};

export const useAdminAddCustomerAddress = (
	options?: UseMutationOptions<
		Response<Customer>,
		Error,
		AdminAddCustomerAddressVariables
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationFn: ({ customerId, payload }: AdminAddCustomerAddressVariables) =>
			client.admin.custom.post(
				`/admin/customers/${customerId}/address`,
				payload
			),
		onSuccess: (data, variables, context) => {
			customerListInvalidateKeys(variables.customerId).forEach((key) =>
				queryClient.invalidateQueries({ queryKey: key })
			);
			options?.onSuccess?.(data, variables, context);
		},
	});
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
