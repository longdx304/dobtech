import { WarehouseKiotBySkuResponse, WarehouseKiotList } from '@/types/kiot';
import {
	AdminWarehousesListRes,
	AdminWarehouseTransactionsRes,
} from '@/types/warehouse';
import generateParams from '@/utils/generate-params';
import { Response } from '@medusajs/medusa-js';
import { useQuery } from '@tanstack/react-query';
import {
	queryKeysFactory,
	useMedusa,
	UseQueryOptionsWrapper,
} from 'medusa-react';

const ADMIN_WAREHOUSE = `admin_warehouse` as const;

export const adminWarehouseKeys = queryKeysFactory(ADMIN_WAREHOUSE);

const ADMIN_WAREHOUSE_KIOT = `admin_warehouse_kiot` as const;

export const adminWarehouseKiotKeys = queryKeysFactory(ADMIN_WAREHOUSE_KIOT);

type WarehouseQueryKey = typeof adminWarehouseKeys;

type WarehouseKiotQueryKey = typeof adminWarehouseKiotKeys;

export const useAdminWarehouses = (
	/**
	 * Filters and pagination configurations to apply on retrieved currencies.
	 */
	query?: Record<string, unknown>,
	options?: UseQueryOptionsWrapper<
		Response<AdminWarehousesListRes>,
		Error,
		ReturnType<WarehouseQueryKey['list']>
	>
) => {
	const { client } = useMedusa();
	const params = query && generateParams(query);
	const { data, ...rest } = useQuery(
		adminWarehouseKeys.list(query),
		() => client.admin.custom.get(`/admin/warehouse${params}`),
		options
	);
	return { ...data, ...rest } as const;
};

export const useAdminWarehousesKiot = (
	/**
	 * Filters and pagination configurations to apply on retrieved currencies.
	 */
	query?: Record<string, unknown>,
	options?: UseQueryOptionsWrapper<
		Response<WarehouseKiotList>,
		Error,
		ReturnType<WarehouseKiotQueryKey['list']>
	>
) => {
	const { client } = useMedusa();
	const params = query && generateParams(query);
	const { data, ...rest } = useQuery(
		adminWarehouseKiotKeys.list(query),
		() => client.admin.custom.get(`/admin/kiot/warehouse${params}`),
		options
	);
	return { ...data, ...rest } as const;
};

export const useAdminWarehousesInventoryVariant = (
	/**
	 * Filters and pagination configurations to apply on retrieved currencies.
	 */
	query?: Record<string, unknown>,
	options?: UseQueryOptionsWrapper<
		Response<any>,
		Error,
		ReturnType<WarehouseQueryKey['list']>
	>
) => {
	const { client } = useMedusa();
	const params = query && generateParams(query);
	const { data, ...rest } = useQuery(
		adminWarehouseKeys.list(query),
		() =>
			client.admin.custom.get(
				`/admin/warehouse/manage/inventory-variants${params}`
			),
		options
	);
	return { ...data, ...rest } as const;
};

export const useAdminWarehouse = (id: string) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		adminWarehouseKeys.detail(id),
		() => client.admin.custom.get(`/admin/warehouse/${id}`),
		{
			enabled: !!id,
		}
	);
	return { ...data, ...rest } as const;
};

export const useAdminWarehouseInventoryByVariant = (variantId: string) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		adminWarehouseKeys.detail(variantId),
		() => client.admin.custom.get(`/admin/warehouse/variant/${variantId}`),
		{
			enabled: !!variantId,
		}
	);
	return { ...data, ...rest } as const;
};

export const useAdminWarehouseInventoryKiotBySku = (sku: string) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		adminWarehouseKiotKeys.detail(sku),
		() => client.admin.custom.get(`/admin/kiot/warehouse/inventory?sku=${sku}`),
		{ enabled: !!sku }
	);
	return { ...data, ...rest } as const;
};

export const useAdminWarehouseTransactions = (
	/**
	 * Filters and pagination configurations to apply on retrieved currencies.
	 */
	query?: Record<string, unknown>,
	options?: UseQueryOptionsWrapper<
		Response<AdminWarehouseTransactionsRes>,
		Error,
		ReturnType<WarehouseQueryKey['list']>
	>
) => {
	const { client } = useMedusa();
	const params = query && generateParams(query);

	const { data, ...rest } = useQuery(
		adminWarehouseKeys.list(query),
		() => client.admin.custom.get(`/admin/warehouse/transaction${params}`),
		options
	);
	return { ...data, ...rest } as const;
};

// Kiot warehouse manage
const ADMIN_WAREHOUSE_KIOT_MANAGE = `admin_warehouse_kiot_manage` as const;

export const adminWarehouseKiotManageKeys = queryKeysFactory(
	ADMIN_WAREHOUSE_KIOT_MANAGE
);
type WarehouseKiotManageQueryKey = typeof adminWarehouseKiotManageKeys;

export const useAdminWarehouseManageKiotBySku = (
	query?: Record<string, unknown>,
	options?: UseQueryOptionsWrapper<
		Response<WarehouseKiotBySkuResponse>,
		Error,
		ReturnType<WarehouseKiotManageQueryKey['list']>
	>
) => {
	const { client } = useMedusa();
	const params = query && generateParams(query);

	const { data, ...rest } = useQuery(
		adminWarehouseKiotManageKeys.list(query),
		() => client.admin.custom.get(`/admin/kiot/warehouse/manage/sku${params}`),
		options
	);
	return { ...data, ...rest } as const;
};
