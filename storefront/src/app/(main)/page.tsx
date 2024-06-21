import { getProductsList } from '@/actions/products';
import { getRegion } from '@/actions/region';
import ProductBanner from '@/modules/products/components/product-banner';
import ProductList from '@/modules/products/components/product-list';

interface Props {
  searchParams: {
    page?: string;
  };
}

const PAGE_SIZE = 20;

export default async function Home({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const region = await getRegion('vn');

  const { response } = await getProductsList({
    pageParam: page,
    queryParams: {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    },
  });

  return (
    <main className='w-full container box-border pt-[6rem] lg:pt-[8rem]'>
      <ProductBanner />
      <h2 className='flex justify-center items-center'>Sản phẩm mới</h2>
      <ProductList data={response} region={region!} page={page} />
    </main>
  );
}
