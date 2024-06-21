import { Metadata } from 'next';

import { getProductsList } from '@/actions/products';
import { getRegion } from '@/actions/region';
import ProductList from '@/modules/products/components/product-list';
import RefinementList from '@/modules/store/components/refinement-list';
import { SortOptions } from '@/modules/store/components/refinement-list/sort-products';

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Tìm kiếm',
  description: 'Tìm kiếm sản phẩm',
};

type Params = {
  params: { value: string };
  searchParams: { page?: string };
};

const PAGE_SIZE = 20;
export default async function SearchPage({ params, searchParams }: Params) {
  const searchValue = decodeURIComponent(params?.value || '');
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const region = await getRegion('vn');

  const queryParams = {
    q: searchValue,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const { response } = await getProductsList({
    pageParam: page,
    queryParams,
  });

  return (
    <div className='w-full box-border container pt-[4rem] lg:pt-[6rem]'>
      <RefinementList
        sortBy={searchValue as SortOptions}
        data-testid='sort-by-container'
      />
      <ProductList
        data={response}
        region={region!}
        searchValue={searchValue}
        page={page}
      />
    </div>
  );
}
