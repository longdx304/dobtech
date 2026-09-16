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

export type AdminDraftOrderTransferReq = {
	id: string;
	isSendEmail?: boolean;
	urlPdf: string;
	sales_person_id?: string | null;
	invoice_parts?: Array<{
		profile_id: string;
		consumer_name?: string | null;
		consumer_address?: string | null;
		items: Array<{ variant_id: string; quantity: number }>;
	}>;
};

export const useAdminDraftOrderTransferOrder = (
	options?: UseMutationOptions<
		Response<AdminDraftOrderTransferRes>,
		Error,
		AdminDraftOrderTransferReq
	>
) => {
	const { client } = useMedusa();

	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminDraftOrderTransferReq) =>
			client.admin.custom.post(`/admin/draft-orders/${payload.id}/transfer`, {
				isSendEmail: payload.isSendEmail,
				urlPdf: payload.urlPdf,
				sales_person_id: payload.sales_person_id,
				invoice_parts: payload.invoice_parts,
			}),
		buildOptions(
			queryClient,
			[
				adminDraftOrderKeys.details(),
				adminDraftOrderKeys.lists(),
				adminOrderKeys.lists(),
			],
			options
		)
	);
};
