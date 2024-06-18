import {
  getProductsList
} from '@/actions/products';
import { getRegion } from '@/actions/region';
import ProductBanner from '@/modules/products/components/product-banner';
import ProductList from '@/modules/products/components/product-list';

interface Props {
  searchParams: Record<string, unknown>;
}



export default async function Home({ searchParams }: Props) {
  //  * *
  //  TODO: typescript type any
  //  */
  const { response } = await getProductsList({
    pageParam: 0,
  } as any);

  const region = await getRegion('vn');


  return (
    <main className='w-full container box-border pt-[6rem] lg:pt-[8rem]'>
      <ProductBanner />
      <h2 className='flex justify-center items-center'>Sản phẩm mới</h2>
      <ProductList data={response} region={region!} />
    </main>
  );
}
