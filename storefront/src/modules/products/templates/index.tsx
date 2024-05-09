import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import ImageGallery from '../components/image-gallery';
import ProductInfo from '../components/product-info';
import ProductActions from '../components/product-actions';
import { Region } from '@medusajs/medusa';
import ProductActionsWrapper from './product-actions-wrapper';
import { Divider } from 'antd';
import ProductTabs from '../components/product-tabs';
import ProductReviews from '../components/product-reviews';
import SkeletonRelatedProducts from '@/modules/skeletons/templates/skeleton-related-products';
import RelatedProducts from '../components/related-products';

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
        <div className='flex relative justify-around small:max-w-[300px] w-full py-8'>
          <ImageGallery images={product?.images || []} />
          <div className='flex flex-col w-[420px]'>
            <ProductInfo product={product} region={region} />

            <Divider />

            {/* Variant */}
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
