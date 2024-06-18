import { cn } from '@/lib/utils';
import { getProductPrice } from '@/lib/utils/get-product-price';
import { RegionInfo } from '@/types/product';
import {
  PricedProduct,
  PricedVariant,
} from '@medusajs/medusa/dist/types/pricing';

export default function ProductPrice({
  product,
  variant,
  region,
  className,
}: {
  product: PricedProduct;
  variant?: PricedVariant;
  region?: RegionInfo;
  className?: string;
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
    region,
  });

  const selectedPrice = variant ? variantPrice : cheapestPrice;

  if (!selectedPrice) {
    return <div className='block w-32 h-9 bg-gray-100 animate-pulse' />;
  }

  // Format price
  const formattedPrice = (priceString: string) => {
    const price = Number(priceString.replace(/[^\d.-]/g, ''));
    const formattedPrice =
      isNaN(price) || price === 0 ? '-' : `${price.toLocaleString()}₫`;
    return formattedPrice;
  };

  return (
    <div className='bg-white'>
      <div className='flex items-center space-x-2'>
        <span
          className={cn('text-xl font-bold', {
            'text-[#FA6338]': selectedPrice.price_type === 'sale',
          })}
        >
          {formattedPrice(selectedPrice.calculated_price)}
        </span>
        {selectedPrice.price_type === 'sale' && (
          <div className='flex items-center text-xs'>
            <div
              className='px-1.5 py-1 bg-[#FFECE9] text-[#FA6338] '
            >
              Ước tính
            </div>
            <div
              className=' font-bold bg-[#FFD9CE] text-[#FA6338] px-[3px] py-[2px] '
            >
              -{selectedPrice.percentage_diff}%
            </div>
            <span
              className='line-through ml-2 text-gray-500 text-xs'
              data-testid='original-product-price'
              data-value={selectedPrice.original_price_number}
            >
              {formattedPrice(selectedPrice.original_price)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
