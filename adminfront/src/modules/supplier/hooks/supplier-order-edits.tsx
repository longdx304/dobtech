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
			return response.data as any;
		},
		{
			keepPreviousData: true,
		}
	);
};

export const useAdminSupplierOrderEdit = (id: string) => {
	return useQuery(
		['admin-supplier-order-edit', id],
		async () => {
			const response = await api.supplierOrderEdits.retrieve(id);
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

export const useAdminUpdateSupplierOrderEdit = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation(
		async (data: any) => {
			const response = await api.supplierOrderEdits.update(id, data);
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

export const useAdminCancelSupplierOrderEdit = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation(
		async () => {
			const response = await api.supplierOrderEdits.cancel(id);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};

export const useAdminConfirmSupplierOrderEdit = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation(
		async () => {
			const response = await api.supplierOrderEdits.confirm(id);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};

export const useAdminSupplierOrderEditAddLineItem = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation(
		async (data: any) => {
			const response = await api.supplierOrderEdits.addLineItem(id, data);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};

export const useAdminSupplierOrderEditUpdateLineItem = (
	id: string,
	lineItemId: string
) => {
	const queryClient = useQueryClient();

	return useMutation(
		async (data: any) => {
			const response = await api.supplierOrderEdits.updateLineItem(
				id,
				lineItemId,
				data
			);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};

export const useAdminSupplierOrderEditDeleteLineItem = (
	id: string,
	lineItemId: string
) => {
	const queryClient = useQueryClient();

	return useMutation(
		async () => {
			const response = await api.supplierOrderEdits.deleteLineItem(
				id,
				lineItemId
			);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};

export const useAdminRequestSOrderEditConfirmation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation(
		async () => {
			const response = await api.supplierOrderEdits.requestConfirmation(id);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};

export const useAdminDeleteSOrderEditItemChange = (
	id: string,
	itemChangeId: string
) => {
	const queryClient = useQueryClient();

	return useMutation(
		async () => {
			const response = await api.supplierOrderEdits.deleteItemChange(
				id,
				itemChangeId
			);
			return response.data as unknown as any;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['admin-supplier-order-edits']);
			},
		}
	);
};
