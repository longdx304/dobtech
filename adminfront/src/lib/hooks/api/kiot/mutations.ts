import { buildOptions } from '@/utils/build-options';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { queryKeysFactory, useMedusa } from 'medusa-react';

const ADMIN_KIOT = `admin_kiot` as const;

export const adminKiotKeys = queryKeysFactory(ADMIN_KIOT);

interface AdminKiotUpdateItemOrderRes {
	success: boolean;
}

interface AdminKiotUpdateItemOrderReq {
	warehouse_quantity: number;
}

export const useUpdateItemOrderAdminKiot = (
	id: string,
	itemId: string,
	options?: UseMutationOptions<
		Response<AdminKiotUpdateItemOrderRes>,
		Error,
		AdminKiotUpdateItemOrderReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminKiotUpdateItemOrderReq) =>
			client.admin.custom.post(
				`/admin/kiot/order/${id}/items/${itemId}`,
				payload
			),
		buildOptions(queryClient, [adminKiotKeys.lists()], options)
	);
};

export const useExportWarehouseData = (
	options?: UseMutationOptions<
		Response<{ fileKey: string; fileSize: number; downloadUrl: string }>,
		Error,
		{ filterable_fields?: Record<string, any> }
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: { filterable_fields?: Record<string, any> }) =>
			client.admin.custom.post(`/admin/kiot/warehouse/export`, payload),
		buildOptions(queryClient, [], options)
	);
};
