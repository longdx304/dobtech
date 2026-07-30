import { buildOptions } from '@/utils/build-options';
import { Order } from '@/types/order';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { queryKeysFactory, useMedusa } from 'medusa-react';

const ADMIN_ORDER = `admin_order` as const;

export const adminOrderKeys = queryKeysFactory(ADMIN_ORDER);

interface AdminOrderAsignRes {
	success: boolean;
}

interface AdminPostOrderAssignReq {
	handler_id: string;
}

export const useAdminAsignOrder = (
	id: string,
	options?: UseMutationOptions<
		Response<AdminOrderAsignRes>,
		Error,
		AdminPostOrderAssignReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostOrderAssignReq) =>
			client.admin.custom.post(`/admin/order/${id}`, payload),
		buildOptions(queryClient, [adminOrderKeys.lists()], options)
	);
};

interface AdminOrderSalesPersonRes {
	order: Order;
}

interface AdminPostOrderSalesPersonReq {
	sales_person_id: string | null;
}

export const useAdminUpdateOrderSalesPerson = (
	id: string,
	options?: UseMutationOptions<
		Response<AdminOrderSalesPersonRes>,
		Error,
		AdminPostOrderSalesPersonReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostOrderSalesPersonReq) =>
			client.admin.custom.post(`/admin/orders/${id}/sales-person`, payload),
		buildOptions(queryClient, [adminOrderKeys.lists()], options)
	);
};
