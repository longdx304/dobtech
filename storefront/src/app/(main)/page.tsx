import { getCategoryByHandle } from '@/actions/productCategory';
import { getProductsList } from '@/actions/products';
import ProductList from '@/modules/products/components/product-list';

// const PRODUCT_LIMIT = 2;

// type PaginatedProductsParams = {
//   limit: number;
//   collection_id?: string[];
//   category_id?: string[];
//   id?: string[];
// };

interface Props {
  searchParams: Record<string, unknown>;
}

export default async function Home({ searchParams }: Props) {
  //  * * 
  //  TODO: typescript type any
  //  */
  const { response } = await getProductsList({
    pageParam: searchParams,
    // queryParams,
  } as any);

  const { product_categories } = await getCategoryByHandle(
    ['pants']
  ).then((product_categories) => product_categories);

  console.log('product_categories', product_categories);

  return (
    <main className='w-full container pt-[8rem]'>
      <ProductList data={response} />
    </main>
  );
}
