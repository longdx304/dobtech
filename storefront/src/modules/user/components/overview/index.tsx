import { ProductPreviewType } from '@/types/product';
import OverviewDesktop from './OverviewDesktop';
import OverviewMobile from './OverviewMobile';
import { Region } from '@medusajs/medusa';

type OverviewProps = {
  products: {
    products: ProductPreviewType[];
    count: number;
  };
  region: Region;
};

const Overview = ({ products, region }: OverviewProps) => {
  return (
    <>
      <div className='hidden lg:block'>
        <OverviewDesktop />
      </div>
      <div className='block lg:hidden'>
        <OverviewMobile products={products} region={region} />
      </div>
    </>
  );
};

export default Overview;
