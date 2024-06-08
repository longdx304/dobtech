'use client';

import { ProductPreviewType } from '@/types/product';
import OverviewDesktop from './OverviewDesktop';
import OverviewMobile from './OverviewMobile';

type OverviewProps = {
  products: {
    products: ProductPreviewType[];
    count: number;
  };
};

const Overview = ({ products }: OverviewProps) => {
  return (
    <>
      <div className='hidden lg:block'>
        <OverviewDesktop />
      </div>
      <div className='block lg:hidden'>
        <OverviewMobile products={products} />
      </div>
    </>
  );
};

export default Overview;
