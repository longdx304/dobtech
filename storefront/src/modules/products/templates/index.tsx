import React, { Suspense } from 'react';

import ImageGallery from '../components/image-gallery';
import ProductInfo from '../components/product-info';
import ProductTabs from '../components/product-tabs';
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
        <div className='w-full lg:flex-grow lg:pr-4'>
          <ImageGallery />
        </div>
        <div className='w-full lg:flex-grow lg:pr-4'>
					<Suspense>
						<ProductActionsWrapper
							countryCode={countryCode}
							handle={handle}
						/>
					</Suspense>
        </div>
      </div>
      <ProductTabs />
      {/* <ProductReviews /> */}
      {/* <div
				className="my-16 small:my-32"
				data-testid="related-products-container"
			>
				<Suspense fallback={<SkeletonRelatedProducts />}>
					<RelatedProducts
						product={product}
						countryCode={countryCode}
					/>
				</Suspense>
			</div> */}
    </>
  );
};

export default ProductTemplate;
