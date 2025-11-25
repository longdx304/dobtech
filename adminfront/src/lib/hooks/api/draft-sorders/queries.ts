import {
	DraftSupplierOrderListRes,
	DraftSupplierOrderQueryParams,
	DraftSupplierOrderRes,
} from '@/types/draft-supplier-order';
import generateParams from '@/utils/generate-params';
import { FindParams } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import { useQuery } from '@tanstack/react-query';
import {
	queryKeysFactory,
	useMedusa,
	UseQueryOptionsWrapper,
} from 'medusa-react';

const DRAFT_SUPPLIER_ORDER_LIST = `admin-draft-supplier-order` as const;

export const draftSupplierOrderKeys = queryKeysFactory(
	DRAFT_SUPPLIER_ORDER_LIST
);

type DraftSupplierOrderQueryKey = typeof draftSupplierOrderKeys;

export const useAdminDraftSupplierOrders = (
	/**
	 * Filters and pagination configurations to apply on retrieved draft supplier orders.
	 */
	query?: DraftSupplierOrderQueryParams,
	options?: UseQueryOptionsWrapper<
		Response<DraftSupplierOrderListRes>,
		Error,
		ReturnType<DraftSupplierOrderQueryKey['list']>
	>
) => {
	const { client } = useMedusa();

	const { data, ...rest } = useQuery(
		draftSupplierOrderKeys.list(query),
		() => {
			const params = query && generateParams(query);
			return client.admin.custom.get(`/admin/draft-supplier-orders${params}`);
		},
		options
	);
	return { ...data, ...rest } as const;
};

export const useAdminDraftSupplierOrder = (
	id: string,
	query?: FindParams,
	options?: UseQueryOptionsWrapper<
		Response<DraftSupplierOrderRes>,
		Error,
		ReturnType<DraftSupplierOrderQueryKey['detail']>
	>
) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		draftSupplierOrderKeys.detail(id),
		() => {
			const params = query && generateParams(query);
			return client.admin.custom.get(`/admin/draft-supplier-orders/${id}${params || ''}`);
		},
		{
			...options,
			enabled: !!id && (options?.enabled !== undefined ? options.enabled : true),
		}
	);
	return { ...data, ...rest } as const;
};

