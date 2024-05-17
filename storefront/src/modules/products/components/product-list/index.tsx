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
  return (
    <Flex vertical gap='middle' justify='center'>
      <div className='grid grid-cols-5 w-full gap-x-6 gap-y-6'>
        {data.products?.map((product) => (
          <ProductPreview key={product.id} data={product} />
        ))}
      </div>
    </Flex>
  );
};

export default ProductList;
