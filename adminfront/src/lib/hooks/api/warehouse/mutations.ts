import {
	AdminInventoryRemoveRes,
	AdminPostInboundInventoryReq,
	AdminPostManageInventoryWarehouseReq,
	AdminPostManageWarehouseVariantReq,
	AdminPostRemmoveInventoryReq,
	AdminPostWarehouseInventoryKiotReq,
	AdminPostWarehouseReq,
	AdminWarehouseDeleteRes,
	AdminWarehouseRes,
	OrderInWarehouseKiot,
} from '@/types/warehouse';
import { buildOptions } from '@/utils/build-options';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { useMedusa } from 'medusa-react';
import {
	adminWarehouseKeys,
	adminWarehouseKiotKeys,
	adminWarehouseKiotManageKeys,
} from './queries';
import {
	WarehouseKiotVariantReq,
	WarehouseKiotWithInventory,
} from '@/types/kiot';
import { adminProductOutboundKiotItemCodeKeys } from '../product-outbound/queries';
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

export const useAdminCreateWarehouseKiot = (
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
			client.admin.custom.post(`/admin/kiot/warehouse`, payload),
		buildOptions(queryClient, [adminWarehouseKiotKeys.lists()], options)
	);
};

export const useAdminCreateWarehouseKiotInventory = (
	options?: UseMutationOptions<Response<any>, Error, WarehouseKiotWithInventory>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation((payload: WarehouseKiotWithInventory) => {
		const queryKeys = [
			adminWarehouseKiotKeys.lists(),
			adminProductOutboundKiotItemCodeKeys.detail(payload.sku),
		];
		return client.admin.custom
			.post(`/admin/kiot/warehouse/inventory/create`, payload)
			.then((response) => {
				queryClient.invalidateQueries(queryKeys);
				return response;
			});
	}, options);
};

export const useAdminCreateWarehouseInventoryKiot = (
	options?: UseMutationOptions<
		Response<any>,
		Error,
		AdminPostWarehouseInventoryKiotReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostWarehouseInventoryKiotReq) =>
			client.admin.custom.post(`/admin/kiot/warehouse/inventory`, payload),
		buildOptions(queryClient, [adminWarehouseKiotKeys.lists()], options)
	);
};

export const useAdminCreateWarehouseVariant = (
	options?: UseMutationOptions<
		Response<any>,
		Error,
		AdminPostManageWarehouseVariantReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostManageWarehouseVariantReq) =>
			client.admin.custom.post(`/admin/warehouse/manage/variant`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminDeleteWarehouse = (
	options?: UseMutationOptions<Response<AdminWarehouseDeleteRes>, Error, string>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(id: string) => client.admin.custom.delete(`/admin/warehouse/${id}`),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminCreateInventory = (
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
			client.admin.custom.post(`/admin/warehouse/inbound`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminAddInventoryToWarehouse = (
	options?: UseMutationOptions<
		Response<AdminWarehouseRes>,
		Error,
		AdminPostManageInventoryWarehouseReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostManageInventoryWarehouseReq) =>
			client.admin.custom.post(`/admin/warehouse/manage/add`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminAddInventoryToWarehouseKiot = (
	options?: UseMutationOptions<
		Response<AdminWarehouseRes>,
		Error,
		OrderInWarehouseKiot
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: OrderInWarehouseKiot) =>
			client.admin.custom.post(`/admin/kiot/warehouse/add`, payload),
		buildOptions(queryClient, [adminWarehouseKiotKeys.lists()], options)
	);
};

export const useAdminRemoveInventory = (
	options?: UseMutationOptions<
		Response<AdminInventoryRemoveRes>,
		Error,
		AdminPostRemmoveInventoryReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostRemmoveInventoryReq) =>
			client.admin.custom.post(`/admin/warehouse/outbound`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminRemoveInventoryKiot = (
	options?: UseMutationOptions<
		Response<AdminInventoryRemoveRes>,
		Error,
		OrderInWarehouseKiot
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: OrderInWarehouseKiot) =>
			client.admin.custom.post(`/admin/kiot/warehouse/remove`, payload),
		buildOptions(queryClient, [adminWarehouseKiotKeys.lists()], options)
	);
};

export const useAdminRemoveInventoryToWarehouse = (
	options?: UseMutationOptions<
		Response<AdminWarehouseRes>,
		Error,
		AdminPostManageInventoryWarehouseReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostManageInventoryWarehouseReq) =>
			client.admin.custom.post(`/admin/warehouse/manage/remove`, payload),
		buildOptions(queryClient, [adminWarehouseKeys.lists()], options)
	);
};

export const useAdminCreateWarehouseLocationKiot = (
	options?: UseMutationOptions<Response<any>, Error, WarehouseKiotWithInventory>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: WarehouseKiotWithInventory) =>
			client.admin.custom.post(`/admin/kiot/warehouse/manage/sku`, payload),
		buildOptions(queryClient, [adminWarehouseKiotManageKeys.lists()], options)
	);
};

export const useAdminCreateWarehouseVariantKiot = (
	options?: UseMutationOptions<Response<any>, Error, WarehouseKiotVariantReq>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: WarehouseKiotVariantReq) =>
			client.admin.custom.post(`/admin/kiot/warehouse/manage/add`, payload),
		buildOptions(
			queryClient,
			[adminWarehouseKiotManageKeys.lists(), adminWarehouseKiotKeys.lists()],
			options
		)
	);
};

export const useAdminDeleteWarehouseVariantKiot = (
	options?: UseMutationOptions<Response<any>, Error, WarehouseKiotVariantReq>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: WarehouseKiotVariantReq) =>
			client.admin.custom.post(`/admin/kiot/warehouse/manage/remove`, payload),
		buildOptions(
			queryClient,
			[adminWarehouseKiotManageKeys.lists(), adminWarehouseKiotKeys.lists()],
			options
		)
	);
};
