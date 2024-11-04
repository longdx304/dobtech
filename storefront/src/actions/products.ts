'use server';
import { medusaClient } from '@/lib/database/config';
import { StoreGetProductsParams } from '@medusajs/medusa';
import { cache } from 'react';

import { getRegion } from '@/actions/region';
import transformProductPreview from '@/lib/utils/transform-product-preview';
import { ProductPreviewType } from '@/types/product';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { getMedusaHeaders } from './auth';
import sortProducts from '@/lib/utils/sort-products';
import { SortOptions } from '@/modules/store/components/refinement-list/sort-products';

const emptyResponse = {
	response: { products: [], count: 0 },
	nextPage: null,
};

// Product actions
export const getProductsList = cache(async function ({
	pageParam = 0,
	queryParams,
	countryCode = 'vn',
}: {
	pageParam?: number;
	queryParams?: StoreGetProductsParams;
	countryCode?: string;
}): Promise<{
	response: { products: ProductPreviewType[]; count: number };
	nextPage: number | null;
	queryParams?: StoreGetProductsParams;
}> {
	const limit = queryParams?.limit || 20;
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
			{ next: { tags: ['products'], revalidate: 3600, cache: 'force-cache' } }
		)
		.then((res) => res)
		.catch((err) => {
			throw err;
		});

	const transformedProducts = products.map((product) => {
		return transformProductPreview(product, region);
	});

	const nextPage = count > pageParam + 1 ? pageParam + 1 : null;

	return {
		response: { products: transformedProducts, count },
		nextPage,
		queryParams,
	};
});

export const getProductByHandle = cache(async function (
	handle: string
): Promise<{ product: PricedProduct }> {
	const headers = await getMedusaHeaders(['products']);

	const product = await medusaClient.products
		.list({ handle }, headers)
		.then(({ products }) => products[0])
		.catch((err) => {
			throw err;
		});

	return { product };
});

export const getProductsById = cache(async function ({
	ids,
	regionId,
}: {
	ids: string[];
	regionId: string;
}) {
	const headers = await getMedusaHeaders(['products']);

	return medusaClient.products
		.list({ id: ids, region_id: regionId }, headers)
		.then(({ products }) => products)
		.catch((err) => {
			console.log(err);
			return null;
		});
});

export const retrievePricedProductById = cache(async function ({
	id,
	regionId,
}: {
	id: string;
	regionId: string;
}) {
	const headers = await getMedusaHeaders(['products']);

	return medusaClient.products
		.retrieve(`${id}?region_id=${regionId}`, headers)
		.then(({ product }) => product)
		.catch((err) => {
			console.log(err);
			return null;
		});
});

export const getProductsListWithSort = cache(
	async function getProductsListWithSort({
		page = 0,
		queryParams,
		sortBy = 'created_at',
		countryCode,
	}: {
		page?: number;
		queryParams?: StoreGetProductsParams;
		sortBy?: SortOptions;
		countryCode: string;
	}): Promise<{
		response: { products: ProductPreviewType[]; count: number };
		nextPage: number | null;
		queryParams?: StoreGetProductsParams;
	}> {
		const limit = queryParams?.limit || 12;

		const {
			response: { products, count },
		} = await getProductsList({
			pageParam: 0,
			queryParams: {
				...queryParams,
				limit: 100,
			},
			countryCode,
		});

		const sortedProducts = sortProducts(products, sortBy);

		const pageParam = (page - 1) * limit;

		const nextPage = count > pageParam + limit ? pageParam + limit : null;

		const paginatedProducts = sortedProducts.slice(
			pageParam,
			pageParam + limit
		);

		return {
			response: {
				products: paginatedProducts,
				count,
			},
			nextPage,
			queryParams,
		};
	}
);
