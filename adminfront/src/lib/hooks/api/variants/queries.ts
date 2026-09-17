import { AdminVariantListRes } from '@/types/variants';
import generateParams from '@/utils/generate-params';
import { Response } from '@medusajs/medusa-js';
import { useQuery } from '@tanstack/react-query';
import {
	queryKeysFactory,
	useMedusa,
	UseQueryOptionsWrapper,
} from 'medusa-react';

const ADMIN_VARIANTS = `admin_variants` as const;

const ADMIN_VARIANT_AVAILABILITY = `admin_variant_availability` as const;

export const adminVariantKeys = queryKeysFactory(ADMIN_VARIANTS);

export const adminVariantAvailabilityKeys = queryKeysFactory(
	ADMIN_VARIANT_AVAILABILITY
);

type VariantQueryKey = typeof adminVariantKeys;

export type AdminVariantAvailability = {
	id: string;
	warehouse_quantity: number;
	committed_quantity: number;
	available_quantity: number;
};

export const useAdminVariantAvailability = (variantIds: string[]) => {
	const normalizedIds = Array.from(new Set(variantIds.filter(Boolean))).sort();
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		adminVariantAvailabilityKeys.list({ ids: normalizedIds }),
		() =>
			client.admin.custom.get(
				`/admin/variants/availability${generateParams({
					ids: normalizedIds.join(','),
				})}`
			) as Promise<{ availability: AdminVariantAvailability[] }>,
		{
			enabled: normalizedIds.length > 0,
		}
	);

	return {
		availability: data?.availability ?? [],
		...rest,
	} as const;
};

export const useAdminVariantsSku = (
	/**
	 * Filters and pagination configurations to apply on retrieved currencies.
	 */
	query?: Record<string, unknown>,
	options?: UseQueryOptionsWrapper<
		Response<AdminVariantListRes>,
		Error,
		ReturnType<VariantQueryKey['list']>
	>
) => {
	const { client } = useMedusa();
	const params = query && generateParams(query);
	const { data, ...rest } = useQuery(
		adminVariantKeys.list(query),
		() => client.admin.custom.get(`/admin/variants/sku${params}`),
		options
	);
	return { ...data, ...rest } as const;
};
