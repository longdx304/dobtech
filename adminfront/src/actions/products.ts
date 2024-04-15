'use server';

// Authentication actions
import { medusaClient } from '@/lib/database/config';
import { Product } from '@medusajs/medusa';

import { TResponse } from '@/types/common';
import { IProductRequest } from '@/types/products';
import { getMedusaHeaders } from './common';

export async function listProducts(
	searchParams: Record<string, unknown>
): Promise<TResponse<Omit<Product, 'password_hash'>> | null> {
	try {
		const headers = await getMedusaHeaders(['products']);

		const limitData: number = (searchParams?.limit as number) ?? 10;
		const page = searchParams?.page ?? 1;
		const offsetData = +limitData * (+page - 1);
		delete searchParams.page;

		const { products, count, offset, limit } =
			await medusaClient.admin.products.list(
				{ ...searchParams, limit: limitData, offset: offsetData },
				headers
			);

		return { products, count, offset, limit } as unknown as TResponse<
			Omit<Product, 'password_hash'>
		>;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function createProduct(payload: IProductRequest) {
	const headers = await getMedusaHeaders(['product']);
	const { title, color, quantity, price, inventoryQuantity } = payload;

	return medusaClient.admin.products.create(
		{
			title,
			is_giftcard: false,
			discountable: false,
		},
		headers
	);
}

export async function createProductVariant(productId: string, payload: any) {
	const headers = await getMedusaHeaders(['product']);
	const { color, quantity, price, inventoryQuantity } = payload;

	return medusaClient.admin.products.createVariant(
		productId,
		{
			title: color,
			prices: [
				{
					amount: price,
					currency_code: 'vnd',
				},
			],
			inventory_quantity: inventoryQuantity,
			metadata: {
				quantity,
			},
		},
		headers
	);
}

