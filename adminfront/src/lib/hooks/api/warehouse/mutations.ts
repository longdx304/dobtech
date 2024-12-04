import {
	AdminInventoryRemoveRes,
	AdminPostCreateOutboundInventoryReq,
	AdminPostInboundInventoryReq,
	AdminPostRemmoveOutboundInventoryReq,
	AdminPostWarehouseReq,
	AdminPostWarehouseVariantReq,
	AdminWarehouseDeleteRes,
	AdminWarehouseRes,
} from '@/types/warehouse';
import { buildOptions } from '@/utils/build-options';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { useMedusa } from 'medusa-react';
import { adminWarehouseKeys } from './queries';

export const useAdminCreateWarehouse = (
	options?: UseMutationOptions<
		Response<AdminWarehouseRes>,
		Error,
		AdminPostWarehouseReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostWarehouseReq) =>
			client.admin.custom.post(`/admin/warehouse`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminCreateWarehouseVariant = (
	options?: UseMutationOptions<
		Response<AdminWarehouseRes>,
		Error,
		AdminPostWarehouseReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostWarehouseVariantReq) =>
			client.admin.custom.post(`/admin/warehouse/variant`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminDeleteWarehouse = (
	id: string,
	options?: UseMutationOptions<Response<AdminWarehouseDeleteRes>, Error, void>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		() => client.admin.custom.delete(`/admin/warehouse/${id}`),
		buildOptions(
			queryClient,
			[adminWarehouseKeys.lists(), adminWarehouseKeys.detail(id)],
			options
		)
	);
};

export const useAdminCreateInboundInventory = (
	options?: UseMutationOptions<
		Response<AdminWarehouseRes>,
		Error,
		AdminPostInboundInventoryReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostInboundInventoryReq) =>
			client.admin.custom.post(`/admin/warehouse/inbound/create`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminRemoveInboundInventory = (
	options?: UseMutationOptions<Response<AdminInventoryRemoveRes>, Error, void>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		() => client.admin.custom.delete(`/admin/warehouse/inbound/remove`),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminCreateOutboundInventory = (
	options?: UseMutationOptions<
		Response<AdminWarehouseRes>,
		Error,
		AdminPostCreateOutboundInventoryReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostCreateOutboundInventoryReq) =>
			client.admin.custom.post(`/admin/warehouse/outbound/create`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminRemoveOutboundInventory = (
	options?: UseMutationOptions<
		Response<AdminInventoryRemoveRes>,
		Error,
		AdminPostRemmoveOutboundInventoryReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostRemmoveOutboundInventoryReq) =>
			client.admin.custom.post(`/admin/warehouse/outbound/remove`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};
