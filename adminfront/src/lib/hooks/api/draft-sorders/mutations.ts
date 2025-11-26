import {
	AddLineItemsReq,
	CompleteReq,
	CreateDraftSupplierOrderReq,
	UpdateDraftSupplierOrderReq,
} from '@/types/draft-supplier-order';
import { buildOptions } from '@/utils/build-options';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { useMedusa } from 'medusa-react';
import { draftSupplierOrderKeys } from './queries';
import { supplierOrdersKeys } from '../supplier-order/queries';

export const useAdminCreateDraftSupplierOrder = (
	options?: UseMutationOptions<
		Response<void>,
		Error,
		CreateDraftSupplierOrderReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: CreateDraftSupplierOrderReq) =>
			client.admin.custom.post(`/admin/draft-supplier-orders`, payload),
		buildOptions(queryClient, [draftSupplierOrderKeys.lists()], options)
	);
};

export const useAdminUpdateDraftSupplierOrder = (
	id: string,
	options?: UseMutationOptions<
		Response<void>,
		Error,
		UpdateDraftSupplierOrderReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: UpdateDraftSupplierOrderReq) =>
			client.admin.custom.post(`/admin/draft-supplier-orders/${id}`, payload),
		buildOptions(
			queryClient,
			[draftSupplierOrderKeys.lists(), draftSupplierOrderKeys.detail(id)],
			options
		)
	);
};

export const useAdminDeleteDraftSupplierOrder = (
	id: string,
	options?: UseMutationOptions<Response<void>, Error, void>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		() => client.admin.custom.delete(`/admin/draft-supplier-orders/${id}`),
		buildOptions(
			queryClient,
			[draftSupplierOrderKeys.lists(), draftSupplierOrderKeys.detail(id)],
			options
		)
	);
};

export const useAdminCompleteDraftSupplierOrder = (
	id: string,
	options?: UseMutationOptions<Response<void>, Error, CompleteReq>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: CompleteReq) =>
			client.admin.custom.post(
				`/admin/draft-supplier-orders/${id}/complete`,
				payload
			),
		buildOptions(
			queryClient,
			[
				draftSupplierOrderKeys.lists(),
				draftSupplierOrderKeys.detail(id),
				supplierOrdersKeys.lists(),
			],
			options
		)
	);
};

export const useAdminAddDraftSupplierOrderLineItems = (
	id: string,
	options?: UseMutationOptions<Response<void>, Error, AddLineItemsReq>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AddLineItemsReq) =>
			client.admin.custom.post(
				`/admin/draft-supplier-orders/${id}/line-items`,
				payload
			),
		buildOptions(
			queryClient,
			[draftSupplierOrderKeys.lists(), draftSupplierOrderKeys.detail(id)],
			options
		)
	);
};

