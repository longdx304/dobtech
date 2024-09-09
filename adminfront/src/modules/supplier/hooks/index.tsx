import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { SupplierListResponse } from '@/types/supplier';

interface Query {
	offset?: number;
	limit?: number;
	[key: string]: any;
}

export const useAdminSuppliers = (query: Query = {}, options = {}) => {
	const { q, offset, limit, ...restQuery } = query;

	return useQuery(
		['admin-suppliers', q, offset, limit, restQuery],
		async () => {
			const response = await api.supplier.list({
				q,
				offset,
				limit,
			});
			return response.data as unknown as SupplierListResponse;
		},
		{
			keepPreviousData: true,
			...options,
		}
	);
};

export const useAdminCreateSupplier = () => {
	const queryClient = useQueryClient();

	return useMutation(
		async (data) => {
			const response = await api.supplier.create(data);
			return response.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-suppliers']);
			},
		}
	);
};

export const useAdminSupplier = (id: string, options = {}) => {
	return useQuery(
		['admin-supplier', id],
		async () => {
			const response = await api.supplier.retrieve(id);
			return response.data;
		},
		options
	);
};

export const useAdminUpdateSupplier = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation(
		async ({ ...data }: any) => {
			const response = await api.supplier.update(id, data);
			return response.data;
		},
		{
			onSuccess: (data: any) => {
				queryClient.invalidateQueries(['admin-suppliers']);
				queryClient.invalidateQueries(['admin-supplier', data.id]);
			},
		}
	);
};

export const useAdminDeleteSupplier = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation(
		async () => {
			const response = await api.supplier.delete(id);
			return response.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-suppliers']);
			},
		}
	);
};
