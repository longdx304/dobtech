import {
	SupplierListResponse,
	SupplierOrder,
	SupplierOrderListRes,
} from '@/types/supplier';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';

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

export const useAdminDeleteSupplier = () => {
	const queryClient = useQueryClient();

	return useMutation(
		async (id: string) => {
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

// Supplier Orders

export const useAdminSupplierOrders = (query: Query = {}, options = {}) => {
	return useQuery(
		['admin-supplier-order', query],
		async () => {
			const response = await api.suplierOrders.list(query);
			return response.data as unknown as SupplierOrderListRes;
		},
		{
			keepPreviousData: true,
			...options,
		}
	);
};

export const useAdminCreateSupplierOrders = () => {
	const queryClient = useQueryClient();

	return useMutation(
		async (data) => {
			const response = await api.suplierOrders.create(data);
			return response.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order']);
			},
		}
	);
};

export function useAdminSupplierOrder(id: string) {
	return useQuery({
		queryKey: ['admin-supplier-order', id],
		queryFn: async () => {
			const response = await api.suplierOrders.retrieve(id);
			return response.data;
		},
	});
}

export function useAdminSupplierOrderUpdateLineItem(id: string) {
	const queryClient = useQueryClient();

	return useMutation(
		async ({ ...data }: any) => {
			const response = await api.suplierOrders.updateLineItem(id, data);
			return response.data;
		},
		{
			onSuccess: (data: any) => {
				queryClient.invalidateQueries(['admin-supplier-order', data.id]);
			},
		}
	);
}

export function useAdminSupplierOrderEditDeleteLineItem() {
	const queryClient = useQueryClient();

	return useMutation(
		async ({ supplierOrderId, lineItemId }: any) => {
			const response = await api.suplierOrders.deleteLineItem(
				supplierOrderId,
				lineItemId
			);
			return response.data;
		},
		{
			onSuccess: (_, { supplierOrderId }) => {
				queryClient.invalidateQueries([
					'admin-supplier-order',
					supplierOrderId,
				]);
			},
		}
	);
}
