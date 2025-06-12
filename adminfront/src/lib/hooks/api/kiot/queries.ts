import { AdminWarehouseTransactionsResKiot } from '@/types/warehouse';
import generateParams from '@/utils/generate-params';
import { Response } from '@medusajs/medusa-js';
import { useQuery } from '@tanstack/react-query';
import {
	queryKeysFactory,
	useMedusa,
	UseQueryOptionsWrapper,
} from 'medusa-react';

const ADMIN_WAREHOUSE_KIOT = `admin_warehouse_kiot` as const;

export const adminWarehouseKiotKeys = queryKeysFactory(ADMIN_WAREHOUSE_KIOT);

type WarehouseQueryKey = typeof adminWarehouseKiotKeys;

export const useAdminWarehouseTransactionsKiot = (
	/**
	 * Filters and pagination configurations to apply on retrieved currencies.
	 */
	query?: Record<string, unknown>,
	options?: UseQueryOptionsWrapper<
		Response<AdminWarehouseTransactionsResKiot>,
		Error,
		ReturnType<WarehouseQueryKey['list']>
	>
) => {
	const { client } = useMedusa();
	const params = query && generateParams(query);

	const { data, ...rest } = useQuery(
		adminWarehouseKiotKeys.list(query),
		() => client.admin.custom.get(`/admin/kiot/transaction${params}`),
		options
	);
	return { ...data, ...rest } as const;
};
