import { Order } from '@/types/order';
import { buildOptions } from '@/utils/build-options';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { useMedusa } from 'medusa-react';
import {
	adminProductOutboundKeys,
	adminProductOutboundKiotKeys,
} from './queries';
import { OrderKiotType } from '@/types/kiot';

export const useAdminProductOutboundHandler = (
	options?: UseMutationOptions<void, Error, { id: string }, unknown> | undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ id }: { id: string }) =>
			client.admin.custom.post(`/admin/product-outbound/${id}/handler`),
		buildOptions(
			queryClient,
			[adminProductOutboundKeys.lists(), adminProductOutboundKeys.details()],
			options
		)
	);
};

export const useAdminUpdateProductOutbound = (
	id: string,
	options?: UseMutationOptions<Response<void>, Error, Partial<Order>>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation((data: Partial<Order>) => {
		return client.admin.custom.post(`/admin/product-outbound/${id}`, data);
	}, buildOptions(queryClient, [adminProductOutboundKeys.lists(), adminProductOutboundKeys.details()]));
};

export const useAdminUpdateProductOutboundKiot = (
	id: string,
	options?: UseMutationOptions<Response<void>, Error, Partial<Order>>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation((data: Partial<Order>) => {
		return client.admin.custom.post(`/admin/kiot/order/${id}`, data);
	}, buildOptions(queryClient, [adminProductOutboundKiotKeys.lists(), adminProductOutboundKiotKeys.details()]));
};

export const useAdminProductOutboundCheck = (
	options?:
		| UseMutationOptions<
				void,
				Error,
				{ id: string; itemId: string[]; checked: boolean },
				unknown
		  >
		| undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({
			id,
			itemId,
			checked,
		}: {
			id: string;
			itemId: string[];
			checked: boolean;
		}) =>
			client.admin.custom.post(`/admin/product-outbound/${id}/check`, {
				itemId,
				checked,
			}),
		buildOptions(
			queryClient,
			[adminProductOutboundKeys.lists(), adminProductOutboundKeys.details()],
			options
		)
	);
};

export const useAdminOrderKiotCheck = (
	options?:
		| UseMutationOptions<
				void,
				Error,
				{ id: number; itemId: string[]; checked: boolean },
				unknown
		  >
		| undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({
			id,
			itemId,
			checked,
		}: {
			id: number;
			itemId: string[];
			checked: boolean;
		}) =>
			client.admin.custom.post(`/admin/kiot/order/${id}/check`, {
				itemId,
				checked,
			}),
		buildOptions(
			queryClient,
			[adminProductOutboundKeys.lists(), adminProductOutboundKeys.details()],
			options
		)
	);
};

export const useAdminProductOutboundRemoveHandler = (
	options?: UseMutationOptions<void, Error, { id: string }, unknown> | undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ id }: { id: string }) =>
			client.admin.custom.delete(`/admin/product-outbound/${id}/handler`),
		buildOptions(
			queryClient,
			[adminProductOutboundKeys.lists(), adminProductOutboundKeys.details()],
			options
		)
	);
};

export const useAdminStockAssignChecker = (
	options?: UseMutationOptions<void, Error, { id: string }, unknown> | undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ id }: { id: string }) =>
			client.admin.custom.post(`/admin/checker-stock/${id}/handler`),
		buildOptions(
			queryClient,
			[adminProductOutboundKeys.lists(), adminProductOutboundKeys.details()],
			options
		)
	);
};

export const useAdminStockRemoveChecker = (
	options?: UseMutationOptions<void, Error, { id: string }, unknown> | undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ id }: { id: string }) =>
			client.admin.custom.delete(`/admin/checker-stock/${id}/handler`),
		buildOptions(
			queryClient,
			[adminProductOutboundKeys.lists(), adminProductOutboundKeys.details()],
			options
		)
	);
};

export const useUpdateOrderKiot = (
	options?:
		| UseMutationOptions<void, Error, { id: string; data: any }, unknown>
		| undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ id, data }: { id: string; data: any }) =>
			client.admin.custom.post(`/admin/kiot/order/${id}`, data),
		buildOptions(
			queryClient,
			[
				adminProductOutboundKiotKeys.lists(),
				adminProductOutboundKiotKeys.details(),
			],
			options
		)
	);
};

// Assign/Unassign Mutations
export const useAssignOrder = (
	options?:
		| UseMutationOptions<
				void,
				Error,
				{ id: string; type: OrderKiotType },
				unknown
		  >
		| undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ id, type }: { id: string; type: OrderKiotType }) =>
			client.admin.custom.post(`/admin/kiot/order/${id}/assign`, { type }),
		buildOptions(
			queryClient,
			[
				adminProductOutboundKiotKeys.lists(),
				adminProductOutboundKiotKeys.details(),
			],
			options
		)
	);
};

export const useUnassignOrder = (
	options?: UseMutationOptions<void, Error, { id: string }, unknown> | undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ id }: { id: string }) =>
			client.admin.custom.post(`/admin/kiot/order/${id}/unassign`),
		buildOptions(
			queryClient,
			[
				adminProductOutboundKiotKeys.lists(),
				adminProductOutboundKiotKeys.details(),
			],
			options
		)
	);
};
