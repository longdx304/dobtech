import { Metadata } from 'next';
import { Suspense, cache } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { listCategories } from '@/actions/productCategories';
import { Flex } from '@/components/Flex';
// import Await from './await';
import Await from '@/components/Await';
import CategoryList from '@/modules/product-categories/components/category-list';
import LoadingSkeleton from './skeleton';
import { ProductCategory } from '@medusajs/medusa';

export const metadata: Metadata = {
	title: 'Manage Product Categories',
	description: 'Categories Page',
};

interface Props {
	searchParams: Record<string, unknown>;
}

export default async function ProductCategories({ searchParams }: Props) {
	const fetchCategories = cache(async () => await listCategories());

	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<Suspense key={uuidv4()} fallback={<LoadingSkeleton />}>
				<Await promise={fetchCategories() as any}>
					{(categories: ProductCategory) => <CategoryList data={categories} />}
				</Await>
			</Suspense>
		</Flex>
	);
}
