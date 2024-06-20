import { FC } from 'react';

import ProductPreview from '@/modules/products/components/product-preview';
import { ProductPreviewType } from '@/types/product';
import { Region } from '@medusajs/medusa';
import Pagination from './pagination';

interface ProductListProps {
  data: {
    products: ProductPreviewType[];
    count: number;
  };
  region?: Region;
  searchValue?: string | null;
  page?: number;
}
const PAGE_SIZE = 20;

const ProductList: FC<ProductListProps> = ({
  data,
  searchValue,
  region,
  page,
}) => {
  return (
    <div className='flex flex-col items-center gap-4 pb-12'>
      {data.products?.length > 0 && (
        <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 max-sm:grid-cols-2 sm:grid-cols-2 w-full gap-x-3 gap-y-3 lg:gap-x-4 lg:gap-y-4'>
          {data.products?.map((product, index) => (
            <ProductPreview key={index} data={product} region={region!} />
          ))}
        </div>
      )}
      <Pagination
        total={data.count}
        currentPage={page || 1}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
};

export default ProductList;
