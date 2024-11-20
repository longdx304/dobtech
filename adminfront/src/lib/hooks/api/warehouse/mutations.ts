import {
	AdminPostWarehouseReq,
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

export const useAdminDeleteItemUnit = (
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
