import { buildOptions } from '@/utils/build-options';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';
import { useMedusa } from 'medusa-react';
import { adminProductOutboundKeys } from './queries';

export const useAdminProductOutboundHandler = (
	options?: UseMutationOptions<void, Error, { id: string }, unknown> | undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ id }: { id: string }) =>
			client.admin.custom.post(`/admin/product-outbound/${id}/handler`),
		buildOptions(queryClient, [adminProductOutboundKeys.lists()], options)
	);
};

export const useAdminProductOutboundRemoveHandler = (
	options?: UseMutationOptions<void, Error, { id: string }, unknown> | undefined
) => {
	const { client } = useMedusa();
	const queryClient = useQueryClient();

	return useMutation(
		({ id }: { id: string }) =>
			client.admin.custom.delete(`/admin/product-outbound/${id}/handler`),
		buildOptions(queryClient, [adminProductOutboundKeys.lists()], options)
	);
};
