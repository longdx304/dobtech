import { buildOptions } from '@/utils/build-options';
import { DraftOrder } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { adminDraftOrderKeys, useMedusa } from 'medusa-react';

export type AdminDraftOrderUpdateMetadataRes = {
	draft_order: DraftOrder;
};

export type AdminDraftOrderUpdateMetadataReq = {
	id: string;
	metadata: Record<string, any>;
};

export const useAdminDraftOrderUpdateMetadata = (
	options?: UseMutationOptions<
		Response<AdminDraftOrderUpdateMetadataRes>,
		Error,
		AdminDraftOrderUpdateMetadataReq
	>
) => {
	const { client } = useMedusa();

	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminDraftOrderUpdateMetadataReq) =>
			client.admin.custom.post(`/admin/draft-orders/${payload.id}/metadata`, {
				metadata: payload.metadata,
			}),
		buildOptions(
			queryClient,
			[
				adminDraftOrderKeys.details(),
				adminDraftOrderKeys.lists(),
			],
			options
		)
	);
};
