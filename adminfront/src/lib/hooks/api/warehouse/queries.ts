import { AdminWarehousesListRes } from '@/types/warehouse';
import { Response } from '@medusajs/medusa-js';
import { useQuery } from '@tanstack/react-query';
import {
	queryKeysFactory,
	useMedusa,
	UseQueryOptionsWrapper,
} from 'medusa-react';

const ADMIN_WAREHOUSE = `admin_warehouse` as const;

export const adminWarehouseKeys = queryKeysFactory(ADMIN_WAREHOUSE);

type WarehouseQueryKey = typeof adminWarehouseKeys;

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
	const { data, ...rest } = useQuery(
		adminWarehouseKeys.list(query),
		() => client.admin.custom.get('/admin/warehouse'),
		options
	);
	return { ...data, ...rest } as const;
};

export const useAdminWarehouse = (id: string) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		adminWarehouseKeys.detail(id),
		() => client.admin.custom.get(`/admin/item-unit/${id}`),
		{
			enabled: !!id,
		}
	);
	return { ...data, ...rest } as const;
};
