import { FC, memo } from 'react';
import { Region } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { getProductPrice } from '@/lib/utils/get-product-price';
import PreviewPrice from './price';

interface ProductPriceProps {
  product: PricedProduct;
  region: Region;
  productHandle: string;
}

const ProductPrice: FC<ProductPriceProps> = ({ product, region, productHandle }) => {
  const { cheapestPrice } = getProductPrice({
    product,
    region,
  });

  if (!cheapestPrice) return null;

  return (
    <PreviewPrice
      price={cheapestPrice}
      productHandle={productHandle}
      product={product}
      region={region}
    />
  );
};

export default memo(ProductPrice);
