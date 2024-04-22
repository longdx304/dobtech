'use server';

// Authentication actions
import { medusaClient } from '@/lib/database/config';

import { TResponse } from '@/types/common';
import { IProductRequest, IProductResponse } from '@/types/products';
import _ from 'lodash';
import { revalidateTag } from 'next/cache';
import { getMedusaHeaders } from './common';

export async function listProducts(
	searchParams: Record<string, unknown>
): Promise<TResponse<IProductResponse> | null> {
	try {
		const headers = await getMedusaHeaders(['users']);

		const limitData: number = (searchParams?.limit as number) ?? 10;
		const page = searchParams?.page ?? 1;
		const offsetData = +limitData * (+page - 1);
		delete searchParams.page;

		const { products, count, offset, limit } =
			await medusaClient.admin.products.list(
				{ ...searchParams, limit: limitData, offset: offsetData },
				headers
			);

		return {
			data: products,
			count,
			offset,
			limit,
		} as unknown as TResponse<IProductResponse>;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function createProduct(payload: IProductRequest) {
	const headers = await getMedusaHeaders(['users']);
	const { title, color, quantity, price, inventoryQuantity } = payload;

	return medusaClient.admin.products
		.create(
			{
				title,
				categories: [],
				is_giftcard: false,
				discountable: true,
				options: [
					{
						title: 'Color',
					},
					{
						title: 'Size',
					},
					{
						title: 'Quantity',
					},
				],
				variants: [
					{
						title: '31',
						prices: [
							{
								amount: +price,
								currency_code: 'vnd',
							},
						],
						inventory_quantity: +inventoryQuantity,
						options: [
							{
								value: color,
							},
							{
								value: 'Small',
							},
							{
								value: quantity as unknown as string,
							},
						],
					},
				],
			},
			headers
		)
		.then(async ({ product }) => {
			if (!_.isEmpty(product)) {
				revalidateTag('users');
				return product;
			}
		})
		.catch((error: any) => {
			console.log('error', error);
			throw new Error(error?.response?.data?.message ?? '');
		});
}

export async function updateProduct(
	productId: string,
	variantId: string,
	optionId: string,
	payload: Partial<IProductRequest>
) {
	const headers = await getMedusaHeaders(['users']);
	const { title, color, quantity, price, inventoryQuantity } = payload;

	
}

export async function deleteProduct(productId: string) {
	const headers = await getMedusaHeaders(['users']);
	return medusaClient.admin.products
		.delete(productId, headers)
		.then(() => {
			revalidateTag('users');
			return;
		})
		.catch((error: any) => {
			throw new Error(error?.response?.data?.message ?? '');
		});
}
