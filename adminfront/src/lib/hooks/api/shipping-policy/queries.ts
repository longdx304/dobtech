import { Response } from '@medusajs/medusa-js';
import { useQuery } from '@tanstack/react-query';
import { useMedusa } from 'medusa-react';

export type ShippingPolicyQuote =
	| { configured: false }
	| {
			configured: true;
			option: {
				id: string;
				name: string;
				amount: number;
				customer_pays_external: boolean;
			};
	  };

export const useAdminShippingPolicyQuote = (
	regionId: string | undefined,
	subtotal: number,
	enabled: boolean
) => {
	const { client } = useMedusa();
	const { data, ...rest } = useQuery(
		['admin-shipping-policy', regionId, subtotal],
		() =>
			client.admin.custom.get(
				`/admin/shipping-policy?region_id=${encodeURIComponent(
					regionId!
				)}&subtotal=${subtotal}`
			) as Promise<Response<ShippingPolicyQuote>>,
		{
			enabled: enabled && !!regionId,
			keepPreviousData: true,
			retry: false,
		}
	);

	return { quote: data, ...rest } as const;
};

