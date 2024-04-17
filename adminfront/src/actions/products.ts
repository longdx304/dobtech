'use server';

// Authentication actions
import { medusaClient } from '@/lib/database/config';
import { Product } from '@medusajs/medusa';

import { TResponse } from '@/types/common';
import { IProductRequest, IProductResponse } from '@/types/products';
import { getMedusaHeaders } from './common';

export async function listProducts(
	searchParams: Record<string, unknown>
): Promise<TResponse<IProductResponse> | null> {
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
	const headers = await getMedusaHeaders(['product']);
	const { title, color, quantity, price, inventoryQuantity } = payload;

	return medusaClient.admin.products.create(
		{
			title,
			is_giftcard: false,
			discountable: true,
			options: [
				{
					title: color, // Color
				},
			],
			variants: [
				{
					title: title,
					prices: [
						{
							amount: price,
							currency_code: 'vnd',
						},
					],
					options: [
						{
							value: 'White',
						},
						{
							value: 'Small',
						},
					],
					length: quantity,
					inventory_quantity: inventoryQuantity,
				},
			],
		},
		headers
	);
}

export async function updateProduct(
	productId: string,
	payload: Partial<IProductRequest>
) {
	const headers = await getMedusaHeaders(['product']);
	const product = await medusaClient.admin.products.retrieve(
		productId,
		headers
	);

	if (!product) {
		throw new Error(`Product with ID ${productId} not found.`);
	}

	const updatedProduct = await medusaClient.admin.products.update(
		productId,
		{
			...product,
			...payload,
		},
		headers
	);
	return updatedProduct;
}

export async function deleteProduct(productId: string) {
	const headers = await getMedusaHeaders(['product']);
	return medusaClient.admin.products.delete(productId, headers);
}
