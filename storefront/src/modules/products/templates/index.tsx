import React, { Suspense } from 'react';

import SkeletonRelatedProducts from '@/modules/skeletons/templates/skeleton-related-products';
import ImageGallery from '../components/image-gallery';
import ProductTabs from '../components/product-tabs';
import RelatedProducts from '../components/related-products';
import ProductActionsWrapper from './product-actions-wrapper';

type ProductTemplateProps = {
  countryCode: string;
  handle: string;
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  countryCode,
  handle,
}) => {
  return (
    <>
      <div className='flex flex-col lg:flex-row justify-between w-full pb-8 gap-4'>
        <div className='w-full lg:w-fit lg:flex-grow lg:pr-4'>
          <ImageGallery />
        </div>
        <div className='w-full lg:w-full lg:flex-grow lg:pl-4'>
          <Suspense>
            <ProductActionsWrapper countryCode={countryCode} handle={handle} />
          </Suspense>
        </div>
      </div>

      <ProductTabs />
      {/* <ProductReviews /> */}
      <div
        className='my-16 small:my-32'
        data-testid='related-products-container'
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts handle={handle} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  );
};

export default ProductTemplate;
