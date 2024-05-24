import { getProductsList } from '@/actions/products';
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
    // queryParams,
  } as any);

  return (
    <main className='w-full container box-border pt-[6rem] lg:pt-[8rem]'>
      <ProductList data={response} />
    </main>
  );
}
