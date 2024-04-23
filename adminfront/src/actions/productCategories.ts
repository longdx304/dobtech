'use server';

// Authentication actions
import { medusaClient } from '@/lib/database/config';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { cache } from 'react';
import _ from 'lodash';

import { getMedusaHeaders } from './common';
import { TResponse } from '@/types/common';
import { ProductCategory } from '@medusajs/medusa';
// TResponse
export async function listCategories(): Promise<ProductCategory | null> {
	try {
		const headers = await getMedusaHeaders(['categories']);

		const { product_categories, count, offset, limit } =
			await medusaClient.admin.productCategories.list(
				{
					parent_category_id: 'null',
					include_descendants_tree: true,
					// expand: 'category_children',
				},
				headers
			);
		return product_categories;
	} catch (error) {
		console.log('error', error);
		return null;
	}
}

export async function createCategory(payload: TCategoryRequest) {
	try {
		const headers = await getMedusaHeaders(['categories']);

		const data = await medusaClient.admin.productCategories.create(
			{
				...payload,
			},
			headers
		);
		if (!_.isEmpty(data?.product_category)) {
			revalidateTag('categories');
			return data.product_category;
		}
		return null;
	} catch (error) {
		throw new Error(error?.response?.data?.message ?? '');
	}
}

export async function updateCategory(
	categoryId: string,
	payload: TCategoryRequest
) {
	try {
		const headers = await getMedusaHeaders(['categories']);

		const data = await medusaClient.admin.productCategories.update(
			categoryId,
			{
				...payload,
			},
			headers
		);
		if (!_.isEmpty(data?.product_category)) {
			revalidateTag('categories');
			return data.product_category;
		}
		return null;
	} catch (error) {
		throw new Error(error?.response?.data?.message ?? '');
	}
}

export async function deleteCategory(categoryId: string) {
	const headers = await getMedusaHeaders(['categories']);

	return medusaClient.admin.productCategories
		.delete(categoryId, headers)
		.then(() => {
			revalidateTag('categories');
			return;
		})
		.catch((error: any) => {
			throw new Error(error?.response?.data?.message ?? '');
		});
}
