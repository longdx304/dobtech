import { getProductsList } from '@/actions/products';
import ProductBanner from '@/modules/products/components/product-banner';
import ProductList from '@/modules/products/components/product-list';
import { Text } from "@/components/Typography";

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
      <ProductBanner />
			<h2 className="flex justify-center items-center">Sản phẩm mới</h2>
      <ProductList data={response} />
    </main>
  );
}
