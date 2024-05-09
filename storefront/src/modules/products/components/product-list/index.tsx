import { FC } from 'react';

import { Flex } from '@/components/Flex';
import ProductPreview from '@/modules/products/components/product-preview';
import { ProductPreviewType } from '@/types/product';

interface ProductListProps {
  data: {
    products: ProductPreviewType[];
    count: number;
  };
}

const ProductList: FC<ProductListProps> = async ({ data }) => {
  // const searchParams = useSearchParams();
  // const currentPage = searchParams.get('page') ?? 1;
  // const router = useRouter();
  // const pathname = usePathname();

  // const handleChangePage = (page: number) => {
  //   const newSearchParams = updateSearchQuery(searchParams, {
  //     page: page.toString(),
  //   });

  //   router.push(`/daily?${newSearchParams}`);
  // };

  return (
    <Flex vertical gap='middle' justify='center'>
      <div className='grid grid-cols-5 w-full gap-x-6 gap-y-6'>
        {data.products?.map((product) => (
          <ProductPreview key={product.id} data={product} />
        ))}
      </div>
      {/* <Pagination
        className='flex justify-center'
        showSizeChanger={false}
        total={data.count ?? 0}
        current={currentPage as number}
        pageSize={data.products.length}
        onChange={handleChangePage}
      /> */}
    </Flex>
  );
};

export default ProductList;
