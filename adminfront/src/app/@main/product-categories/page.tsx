import { Metadata } from 'next';
import { cache } from 'react';
import { Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Flex } from '@/components/Flex';
import { listCategories } from '@/actions/productCategories';
// import Await from './await';
import Await from '@/components/Await';
import LoadingSkeleton from './skeleton';
import CategoryList from '@/modules/product-categories/components/category-list';

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
				<Await promise={new fetchCategories}>
					{(categories) => <CategoryList data={categories} />}
				</Await>
			</Suspense>
		</Flex>
	);
}
