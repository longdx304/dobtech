import ProductList from '@/modules/products/components/product-list';
import { ProductPreviewType } from '@/types/product';
import { Region } from '@medusajs/medusa';
import ItemGroup from './item-group';

type OverviewMobileProps = {
  products: {
    products: ProductPreviewType[];
    count: number;
  };
  region: Region;
};

const OverviewMobile = ({ products, region }: OverviewMobileProps) => {
  return (
    <>
      <ItemGroup />
      {/* Products */}
      <div className='flex-col space-y-2 py-4'>
        <h2 className='w-full h-[50px] flex justify-center items-center bg-[#f6f6f6] mt-0 text-sm'>
          ⬥ Bạn có lẽ cũng thích ⬥
        </h2>
        <div className='px-4 pb-16'>
          <ProductList data={products} region={region} />
        </div>
      </div>
    </>
  );
};

export default OverviewMobile;
