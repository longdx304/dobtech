import { buildOptions } from '@/utils/build-options';
import { DraftOrder } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { adminDraftOrderKeys } from 'medusa-react';
import api from '../../../services/api';

export type AdminDraftOrderTransferRes = {
	draft_order: DraftOrder;
};
export const useAdminDraftOrderTransferOrder = (
	id: string,
	options?: UseMutationOptions<
		Response<AdminDraftOrderTransferRes>,
		Error,
		void
	>
) => {
	const queryClient = useQueryClient();

	return useMutation(async () => {
		const response = await api.draftOrders.transferToOrder(id);
		return response.data as unknown as Response<AdminDraftOrderTransferRes>;
	}, buildOptions(queryClient, [adminDraftOrderKeys.detail(id), adminDraftOrderKeys.lists()], options));
};
