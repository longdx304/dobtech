import SkeletonRelatedProducts from '@/modules/skeletons/templates/skeleton-related-products';
import { Region } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { Divider } from 'antd';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import ImageGallery from '../components/image-gallery';
import ProductActions from '../components/product-actions';
import ProductInfo from '../components/product-info';
import ProductReviews from '../components/product-reviews';
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
        <div className='flex flex-col lg:flex-row justify-around w-full py-8'>
          <div className='w-full lg:w-auto'>
            <ImageGallery images={product?.images || []} />
          </div>
          <div className='flex flex-col w-full lg:w-auto mt-4'>
            <ProductInfo product={product} region={region} />
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
      )}
      <ProductTabs product={product} />
      <ProductReviews />
      <div
        className='content-container my-16 small:my-32'
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
