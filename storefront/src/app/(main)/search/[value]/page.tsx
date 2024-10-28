import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductList from '@/modules/products/components/product-list';
import RefinementList from '@/modules/store/components/refinement-list';
import { SortOptions } from '@/modules/store/components/refinement-list/sort-products';
import HeaderWrapMobile from '@/modules/common/components/header/HeaderWrapMobile';
import { TTreeCategories } from '@/types/productCategory';
import { cache } from 'react';
import { listCategories } from '@/actions/productCategory';
import { Spin } from 'antd';

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Tìm kiếm',
  description: 'Tìm kiếm sản phẩm',
};

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="w-full min-h-[400px] flex items-center justify-center">
    <Spin size="large" />
  </div>
);

type Params = {
  params: { value: string };
  searchParams: { page?: string };
};

const fetchCategories = cache(async () => await listCategories());

export default async function SearchValue({ params, searchParams }: Params) {
  const searchValue = decodeURIComponent(params?.value || '');
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  // Get categories
  const categories = await fetchCategories();

  // Get ancestors of categories
  const getAncestors = (category: any) => {
    const convertedCategory: {
      id: string;
      label: string;
      key: string;
      metadata?: Record<string, string>;
      children?: any[];
    } = {
      id: category.id,
      label: category.name,
      key: category.handle,
      metadata: category.metadata,
    };

    if (category.category_children && category.category_children.length > 0) {
      convertedCategory.children = category.category_children.map(
        (child: any) => getAncestors(child)
      );
    }

    return convertedCategory;
  };

  // Format categories
  const formatCategories: TTreeCategories[] | null =
    categories?.map((category: any) => getAncestors(category)) || null;

  return (
    <div className="w-full box-border container lg:pt-[6rem]">
      <HeaderWrapMobile categories={formatCategories} />
      <RefinementList
        sortBy={searchValue as SortOptions}
        data-testid="sort-by-container"
      />
      <Suspense fallback={<LoadingFallback />}>
        <ProductList page={page} searchValue={searchValue} />
      </Suspense>
    </div>
  );
}