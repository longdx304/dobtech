import { Metadata } from 'next';

import { getProductsList } from '@/actions/products';
import ProductList from '@/modules/products/components/product-list';
import RefinementList from '@/modules/store/components/refinement-list';

export const metadata: Metadata = {
  title: 'CHAMDEP VN | Tìm kiếm',
  description: 'Tìm kiếm sản phẩm',
};

type Params = {
  params: { value: string };
  searchParams: Record<string, unknown>;
};

export default async function SearchPage({ params, searchParams }: Params) {
  const searchValue = decodeURIComponent(params?.value || '');

  const queryParams = {
    q: searchValue,
    limit: 6,
    offset: 0,
  };
  const { response } = await getProductsList({
    pageParam: 0,
    queryParams,
  } as any);

  return (
    <div className='w-full box-border container pt-[4rem] lg:pt-[6rem]'>
      <RefinementList
        sortBy={searchValue as any}
        data-testid='sort-by-container'
      />
      <ProductList data={response} searchValue={searchValue} />
    </div>
  );
}
