import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import InteractiveLink from '@/modules/common/components/interactive-link';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import SkeletonProductGrid from '@/modules/skeletons/templates/skeleton-product-grid';
import RefinementList from '@/modules/store/components/refinement-list';
import { SortOptions } from '@/modules/store/components/refinement-list/sort-products';
import PaginatedProducts from '@/modules/store/templates/paginated-products';
import { ProductCategoryWithChildren } from '@/types/productCategory';
import OptionList from '../components/options-filter';

const COLOR_FILTERS = {
  id: 'color',
  name: 'Color',
  options: [
    { value: 'white', label: 'White' },
    { value: 'beige', label: 'Beige' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
  ] as const,
};

const SIZE_FILTERS = {
  id: 'size',
  name: 'Size',
  options: [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
  ],
} as const;

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
        data-testid='sort-by-container'
      />
      {/* Product */}
      <Suspense fallback={<SkeletonProductGrid />}>
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
