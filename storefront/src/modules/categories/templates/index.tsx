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
  const parents = categories.slice(0, categories.length - 1);

  if (!category || !countryCode) notFound();

  return (
    <main
      className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
      data-testid='category-container'
    >
      <RefinementList
        sortBy={sortBy || 'created_at'}
        data-testid='sort-by-container'
      />
      <section className='pb-24 pt-6'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4'>
          {/* Filters */}
          <div>
            <LocalizedClientLink
              href={`categories/${category.handle}`}
              className='text-black'
            >
              <h3 className='pl-3'>{category.name}</h3>
            </LocalizedClientLink>
            <ul className='space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900 list-none'>
              {category.category_children.map((childCategory) => (
                <li key={childCategory.id}>
                  <InteractiveLink
                    href={`categories/${childCategory.handle}`}
                    className='text-black '
                    isIconHidden={true}
                  >
                    + {childCategory.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>

            <OptionList color={COLOR_FILTERS} size={SIZE_FILTERS} />
          </div>

          {/* Products */}
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sortBy || 'created_at'}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
