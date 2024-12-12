import { MarkAsFulfilledReq, MarkAsFulfilledRes } from '@/types/supplier';
import { buildOptions } from '@/utils/build-options';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { useMedusa } from 'medusa-react';
import { supplierOrdersKeys } from './queries';
import { Response } from '@medusajs/medusa-js';

export type AdminPostDocumentReq = {
	id: string;
	document_url: string[];
};
export const useMarkAsFulfilledMutation = (
	id: string,
	options?:
		| UseMutationOptions<MarkAsFulfilledRes, Error, MarkAsFulfilledReq, unknown>
		| undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(status: MarkAsFulfilledReq) =>
			client.admin.custom.post(
				`/admin/supplier-order/${id}/fulfillment`,
				status
			),
		buildOptions(
			queryClient,
			[supplierOrdersKeys.lists(), supplierOrdersKeys.detail(id)],
			options
		)
	);
};

export const useCreateDocument = (
	options?: UseMutationOptions<Response<void>, Error, AdminPostDocumentReq>
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		(payload: AdminPostDocumentReq) =>
			client.admin.custom.post(`/admin/supplier-order/document`, payload),
		buildOptions(queryClient, [supplierOrdersKeys.lists()], options)
	);
};
