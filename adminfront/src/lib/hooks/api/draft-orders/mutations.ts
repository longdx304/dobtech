import { buildOptions } from '@/utils/build-options';
import { DraftOrder } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { adminDraftOrderKeys, adminOrderKeys, useMedusa } from 'medusa-react';

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
	const { client } = useMedusa();

	const queryClient = useQueryClient();

	return useMutation(
		() => client.admin.custom.post(`/admin/draft-orders/${id}/transfer`),
		buildOptions(
			queryClient,
			[
				adminDraftOrderKeys.detail(id),
				adminDraftOrderKeys.lists(),
				adminOrderKeys.lists(),
			],
			options
		)
	);
};
