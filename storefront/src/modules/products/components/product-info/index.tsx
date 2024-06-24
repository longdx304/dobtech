'use client';

import { Region } from '@medusajs/medusa';
import {
  PricedProduct,
  PricedVariant,
} from '@medusajs/medusa/dist/types/pricing';
import { notFound } from 'next/navigation';
import ProductPrice from '../product-price';

type ProductInfoProps = {
  product: PricedProduct;
  region: Region;
  variant?: PricedVariant;
	options: Record<string, string>;
};

const ProductInfo = ({ product, region, variant, options }: ProductInfoProps) => {
  if (!product || !region) {
    notFound();
  }

  return (
    <div className='relative'>
      <ProductPrice
        className='text-[18px] font-semibold'
        product={product}
        variant={variant as any}
        region={region}
				options={options}
      />
      <h1 className='text-2xl font-semibold'>{product?.title}</h1>
    </div>
  );
};

export default ProductInfo;
