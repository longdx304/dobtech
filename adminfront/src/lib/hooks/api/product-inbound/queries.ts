import { SupplierOrder } from '@/types/supplier';
import { FindParams } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import { useQuery } from '@tanstack/react-query';
import {
	queryKeysFactory,
	useMedusa,
	UseQueryOptionsWrapper,
} from 'medusa-react';

export const ADMIN_PRODUCT_INBOUND = `admin_product_inbound` as const;

export const ADMIN_PRODUCT_INBOUND_KIOT =
	`admin_product_inbound_kiot` as const;
export const ADMIN_PRODUCT_INBOUND_KIOT_ITEM_CODE =
	`admin_product_inbound_kiot_item_code` as const;

export const adminProductInboundKiotKeys = queryKeysFactory(
	ADMIN_PRODUCT_INBOUND_KIOT
);
export const adminProductInboundKiotItemCodeKeys = queryKeysFactory(
	ADMIN_PRODUCT_INBOUND_KIOT_ITEM_CODE
);

export const adminProductInboundKeys = queryKeysFactory(ADMIN_PRODUCT_INBOUND);

type ProductInboundQueryKey = typeof adminProductInboundKeys;
type ProductInboundKiotQueryKey = typeof adminProductInboundKiotKeys;
type ProductInboundKiotItemCodeQueryKey =
	typeof adminProductInboundKiotItemCodeKeys;

export type ProductInboundQueryKeyParams = {
	q?: string;
	offset?: number;
	limit?: number;
	status?: string;
	myOrder?: boolean;
};
export type AdminProductInboundListRes = {
	supplierOrder: SupplierOrder[];
	count: number;
};

export type AdminProductInboundRes = {
	supplierOrder: SupplierOrder;
	count: number;
};

const createQueryString = (search: Record<string, any> = {}) => {
	// Filter out undefined and null values
	const filteredSearch = Object.fromEntries(
		Object.entries(search).filter(
			([_, value]) => value !== undefined && value !== null
		)
	);

	const params = Object.keys(filteredSearch)
		.map((k) => `${k}=${filteredSearch[k]}`)
		.join('&');

	return params ? `?${params}` : '';
};

export const useAdminProductInbounds = (
	/**
	 * Filters and pagination configurations to apply on retrieved currencies.
	 */
	query?: ProductInboundQueryKeyParams,
	options?: UseQueryOptionsWrapper<
		Response<AdminProductInboundListRes>,
		Error,
		ReturnType<ProductInboundQueryKey['list']>
	>
) => {
	const { client } = useMedusa();

	const { data, ...rest } = useQuery(
		adminProductInboundKeys.list(query),
		() => {
			const params = createQueryString(query);
			return client.admin.custom.get(`/admin/product-inbound${params}`);
		},
		options
	);
	return { ...data, ...rest } as const;
};

export const useAdminProductInbound = (
	id: string,
	query?: FindParams,
	options?: UseQueryOptionsWrapper<
		Response<AdminProductInboundRes>,
		Error,
		ReturnType<ProductInboundQueryKey['detail']>
	>
) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		adminProductInboundKeys.detail(id),
		() => client.admin.custom.get(`/admin/product-inbound/${id}`),
		options
	);
	return { ...data, ...rest } as const;
};

export const useGetStockIn = (
	query?: any,
	options?: UseQueryOptionsWrapper<
		Response<any>,
		Error,
		ReturnType<ProductInboundQueryKey['list']>
	>
) => {
	const { client } = useMedusa();
	const params = createQueryString(query);
	const { data, ...rest } = useQuery(
		adminProductInboundKeys.list(query),
		() => client.admin.custom.get(`/admin/kiot/order/stock-in${params}`),
		options
	);

	return { ...data, ...rest } as const;
};
