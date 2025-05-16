import { Order } from '@/types/order';
import { FindParams } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import { useQuery } from '@tanstack/react-query';
import {
	queryKeysFactory,
	useMedusa,
	UseQueryOptionsWrapper,
} from 'medusa-react';

export const ADMIN_PRODUCT_OUTBOUND = `admin_product_outbound` as const;
export const ADMIN_PRODUCT_OUTBOUND_KIOT =
	`admin_product_outbound_kiot` as const;

export const adminProductOutboundKeys = queryKeysFactory(
	ADMIN_PRODUCT_OUTBOUND
);
export const adminProductOutboundKiotKeys = queryKeysFactory(
	ADMIN_PRODUCT_OUTBOUND_KIOT
);

type ProductOutboundQueryKey = typeof adminProductOutboundKeys;
type ProductOutboundKiotQueryKey = typeof adminProductOutboundKiotKeys;

export type ProductOutboundQueryKeyParams = {
	q?: string;
	offset?: number;
	limit?: number;
	fulfillment_status?: string | string[];
	isMyOrder?: boolean;
	order?: string;
};

export type AdminProductOutboundListRes = {
	orders: Order[];
	count: number;
};

export type AdminProductOutboundRes = {
	order: Order;
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
		.map((k) => `${k}=${encodeURIComponent(filteredSearch[k])}`)
		.join('&');

	return params ? `?${params}` : '';
};

export const useAdminProductOutbounds = (
	/**
	 * Filters and pagination configurations to apply on retrieved currencies.
	 */
	query?: ProductOutboundQueryKeyParams,
	options?: UseQueryOptionsWrapper<
		Response<AdminProductOutboundListRes>,
		Error,
		ReturnType<ProductOutboundQueryKey['list']>
	>
) => {
	const { client } = useMedusa();

	const { data, ...rest } = useQuery(
		adminProductOutboundKeys.list(query),
		() => {
			const params = createQueryString(query);
			return client.admin.custom.get(`/admin/product-outbound${params}`);
		},
		options
	);
	return { ...data, ...rest } as const;
};

export const useAdminCheckerStocks = (
	/**
	 * Filters and pagination configurations to apply on retrieved currencies.
	 */
	query?: ProductOutboundQueryKeyParams,
	options?: UseQueryOptionsWrapper<
		Response<AdminProductOutboundListRes>,
		Error,
		ReturnType<ProductOutboundQueryKey['list']>
	>
) => {
	const { client } = useMedusa();

	const { data, ...rest } = useQuery(
		adminProductOutboundKeys.list(query),
		() => {
			const params = createQueryString(query);
			return client.admin.custom.get(`/admin/checker-stock${params}`);
		},
		options
	);
	return { ...data, ...rest } as const;
};

export const useAdminProductOutbound = (
	id: string,
	query?: FindParams,
	options?: UseQueryOptionsWrapper<
		Response<AdminProductOutboundRes>,
		Error,
		ReturnType<ProductOutboundQueryKey['detail']>
	>
) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		adminProductOutboundKeys.detail(id),
		() => client.admin.custom.get(`/admin/product-outbound/${id}`),
		options
	);
	return { ...data, ...rest } as const;
};

export interface OrderDetail {
	id: string;
	product_code: string;
	product_name: string;
	quantity: number;
	warehouse_quantity: number;
}
export interface OrderKiot {
	id: number;
	code: string;
	customer_name: string;
	status: string;
	orderDetails: OrderDetail[];
	handler_id: string;
	handler_at?: string;
	checker_id: string;
	checker_at?: string;
}

export const useGetStockOut = (
	query?: any,
	options?: UseQueryOptionsWrapper<
		Response<any>,
		Error,
		ReturnType<ProductOutboundKiotQueryKey['list']>
	>
) => {
	const { client } = useMedusa();
	const params = createQueryString(query);
	const { data, ...rest } = useQuery(
		adminProductOutboundKiotKeys.list(query),
		() => client.admin.custom.get(`/admin/kiot/order/stock-out${params}`),
		options
	);

	return { ...data, ...rest } as const;
};

export const useListOrdersKiot = (
	query?: any,
	options?: UseQueryOptionsWrapper<
		Response<any>,
		Error,
		ReturnType<ProductOutboundKiotQueryKey['list']>
	>
) => {
	const { client } = useMedusa();

	const { data, ...rest } = useQuery(
		adminProductOutboundKiotKeys.list(query),
		() => client.admin.custom.get(`/admin/kiot/order`),
		options
	);

	return { ...data, ...rest } as const;
};

export const useGetOrder = (
	orderId: string,
	options?: UseQueryOptionsWrapper<
		Response<any>,
		Error,
		ReturnType<ProductOutboundKiotQueryKey['detail']>
	>
) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		adminProductOutboundKiotKeys.detail(orderId),
		() => client.admin.custom.get(`/admin/kiot/order/${orderId}`),
		options
	);

	return { ...data, ...rest } as const;
};
