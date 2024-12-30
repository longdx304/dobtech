import { buildOptions } from '@/lib/utils/build-options';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { queryKeysFactory, useMedusa } from 'medusa-react';

const ADMIN_ORDER = `admin_order` as const;

export const adminOrderKeys = queryKeysFactory(ADMIN_ORDER);

interface StoreUpdateOrderRes {
	success: boolean;
}

interface StoreUpdateOrderReq {
	id: string;
	metadata: Record<string, unknown>;
}

export const useStoreUpdateOrder = (
	options?: UseMutationOptions<
		Response<StoreUpdateOrderRes>,
		Error,
		StoreUpdateOrderReq
	>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation((payload: StoreUpdateOrderReq) => {
		const { id, ...restPayload } = payload;
		console.log('id, ...restPayload:', id, restPayload);
		return client.admin.custom.post(`/store/orders/${id}`, restPayload);
	}, buildOptions(queryClient, [adminOrderKeys.lists()], options));
};
