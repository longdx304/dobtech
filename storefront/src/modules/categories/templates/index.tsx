import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ProductsSkeletonTemplate from '@/modules/skeletons/templates/skeleton-product-grid/product-skeleton';
import RefinementList from '@/modules/store/components/refinement-list';
import { SortOptions } from '@/modules/store/components/refinement-list/sort-products';
import PaginatedProducts from '@/modules/store/templates/paginated-products';
import { ProductCategoryWithChildren } from '@/types/productCategory';

export default function CategoryTemplate({
	categories,
	sortBy,
	page,
	countryCode,
}: {
	categories: ProductCategoryWithChildren[];
	sortBy?: SortOptions;
	page?: string;
	countryCode: string;
}) {
	const pageNumber = page ? parseInt(page) : 1;

	const category = categories[categories.length - 1];

	if (!category || !countryCode) notFound();

	return (
		<>
			<RefinementList
				sortBy={sortBy || 'created_at'}
				data-testid="sort-by-container"
			/>
			{/* Product */}
			<Suspense fallback={<ProductsSkeletonTemplate />}>
				<PaginatedProducts
					sortBy={sortBy || 'created_at'}
					page={pageNumber}
					categoryId={category.id}
					countryCode={countryCode}
				/>
			</Suspense>
		</>
	);
}
