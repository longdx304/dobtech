import SkeletonRelatedProducts from '@/modules/skeletons/templates/skeleton-related-products';
import { Region } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import ImageGallery from '../components/image-gallery';
import ProductActions from '../components/product-actions';
import ProductInfo from '../components/product-info';
import ProductTabs from '../components/product-tabs';
import RelatedProducts from '../components/related-products';
import ProductActionsWrapper from './product-actions-wrapper';

type ProductTemplateProps = {
  product: PricedProduct;
  region: Region;
  countryCode: string;
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound();
  }

  return (
    <>
      {product && (
        <div className='flex flex-col lg:flex-row justify-between w-full pb-8 gap-4'>
          <div className='w-full lg:flex-grow lg:pr-4'>
            <ImageGallery images={product?.images || []} />
          </div>
          <div className='w-full lg:flex-grow lg:pr-4'>
            <ProductInfo product={product} region={region} />
            <div className='hidden lg:block'>
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>
          </div>
        </div>
      )}
      <ProductTabs product={product} />
      {/* <ProductReviews /> */}
      <div
        className='my-16 small:my-32'
        data-testid='related-products-container'
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  );
};

export default ProductTemplate;
