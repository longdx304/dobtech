import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';

interface Query {
	offset?: number;
	limit?: number;
	[key: string]: any;
}

interface CreateOrderEditParams {
	supplier_order_id: string;
}

export const useAdminSupplierOrderEdits = (query: Query = {}) => {
	return useQuery(
		['admin-supplier-order-edits', query],
		async () => {
			const response = await api.supplierOrderEdits.list(query);
			return response.data as unknown as any;
		},
		{
			keepPreviousData: true,
		}
	);
};

export const useAdminCreateSupplierOrderEdit = () => {
	const queryClient = useQueryClient();

	return useMutation(
		async (data: CreateOrderEditParams) => {
			const response = await api.supplierOrderEdits.create(data);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};

export const useAdminUpdateSupplierOrderEdit = () => {
	const queryClient = useQueryClient();

	return useMutation(
		async (data: any) => {
			const response = await api.supplierOrderEdits.update(data.id, data);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};

export const useAdminDeleteSupplierOrderEdit = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation(
		async () => {
			const response = await api.supplierOrderEdits.delete(id);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};

