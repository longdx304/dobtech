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
	const headers = await getMedusaHeaders(['products']);
	const { title, color, quantity, price, inventoryQuantity, sizes } = payload;

	const variants = sizes?.map((size: string) => {
		return {
			title: size,
			prices: [{ amount: +price, currency_code: 'vnd' }],
			inventory_quantity: +inventoryQuantity,
			options: [
				{ value: color },
				{ value: size },
				{ value: quantity as unknown as string },
			],
		};
	});

	return medusaClient.admin.products
		.create(
			{
				title,
				categories: [],
				is_giftcard: false,
				discountable: true,
				options: [{ title: 'Color' }, { title: 'Size' }, { title: 'Quantity' }],
				variants,
			},
			headers
		)
		.then(async ({ product }) => {
			if (!_.isEmpty(product)) {
				revalidateTag('products');
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
	variants: any[],
	options: any[],
	payload: Partial<IProductRequest>
) {
	const headers = await getMedusaHeaders(['products']);
	const { color, quantity, price, inventoryQuantity } = payload;

	const colorOption = options.find(
		(opt: any) => opt.title.toLowerCase() === 'color'
	);
	const sizeOption = options.find(
		(opt: any) => opt.title.toLowerCase() === 'size'
	);
	const quantityOption = options.find(
		(opt: any) => opt.title.toLowerCase() === 'quantity'
	);

	if (!colorOption || !sizeOption || !quantityOption) {
		throw new Error('Color, Size, or Quantity option not found');
	}

	// Get option ids
	const colorOptionId = colorOption.id;
	const sizeOptionId = sizeOption.id;
	const quantityOptionId = quantityOption.id;

	// Matching variant with selected size
	const selectedSizes = payload.sizes;
	const variantWithMatchingSize = variants.filter((variant) => {
		return selectedSizes!.includes(variant.title);
	});

	// Update variant with matching size
	const updatedVariants = variantWithMatchingSize.map(
		(variantWithMatchingSize: any) => {
			return {
				title: variantWithMatchingSize.title,
				prices: [{ amount: +price!, currency_code: 'vnd' }],
				options: [
					{ option_id: colorOptionId, value: color },
					{ option_id: sizeOptionId, value: variantWithMatchingSize.title },
					{ option_id: quantityOptionId, value: quantity },
				],
				inventory_quantity: +inventoryQuantity!,
			};
		}
	);

	// Create an array of update promises
	const updatePromises = updatedVariants.map((updatedVariant, index) => {
		return medusaClient.admin.products
			.updateVariant(
				productId,
				variantWithMatchingSize[index].id,
				updatedVariant,
				headers
			)
			.then(({ product }) => {
				if (!_.isEmpty(product)) {
					return product;
				}
			})
			.catch((error: any) => {
				console.error('Error updating product:', error);
				throw new Error(error?.response?.data?.message ?? '');
			});
	});

	try {
		const updatedProducts = await Promise.all(updatePromises);
		// revalidate after all updates
		revalidateTag('products');
		return updatedProducts;
	} catch (error) {
		console.error('Error updating products:', error);
		throw error; 
	}
}

export async function deleteProduct(productId: string) {
	const headers = await getMedusaHeaders(['products']);
	return medusaClient.admin.products
		.delete(productId, headers)
		.then(() => {
			revalidateTag('products');
			return;
		})
		.catch((error: any) => {
			throw new Error(error?.response?.data?.message ?? '');
		});
}
