import { medusaClient } from "@/lib/database/config";
import { ProductCStoreGetProductsParams } from "@medusajs/medusa";
import { cache } from 'react';

import { ProductPreviewType } from "@/types/product";
import transformProductPreview from '@/lib/utils/transform-product-preview';
import { getRegion } from '@/actions/region';

const emptyResponse = {
  response: { products: [], count: 0 },
  nextPage: null,
}

// Product actions
export const getProductsList = cache(async function ({
	pageParam = 0,
	queryParams,
	countryCode = 'vn',
}: {
	pageParam?: number;
	queryParams?: StoreGetProductsParams;
	countryCode: string;
}): Promise<{
	response: { products: ProductPreviewType[]; count: number };
	nextPage: number | null;
	queryParams?: StoreGetProductsParams;
}> {
	const limit = queryParams?.limit || 12;

	const region = await getRegion(countryCode);
	if (!region) {
    return emptyResponse;
  }

	const { products, count } = await medusaClient.products
		.list(
			{
				limit,
				offset: pageParam,
				region_id: region.id,
				...queryParams,
			},
			{ next: { tags: ["products"] } }
		)
		.then((res) => res)
		.catch((err) => {
			throw err;
		});

	const transformedProducts = products.map((product) => {
		return transformProductPreview(product, region!);
	});

	const nextPage = count > pageParam + 1 ? pageParam + 1 : null;

	return {
		response: { products: transformedProducts, count },
		nextPage,
		queryParams,
	};
});
