'use client';
import { FC } from 'react';
import { ShoppingCart } from 'lucide-react';

import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { Button } from '@/components/Button';
import { ProductPreviewType } from '@/types/product';
import { PriceType } from '../product-actions';

interface Props {
  price: PriceType;
}

const PreviewPrice: FC<Props> = ({ price }) => {
  // Format price
  const formattedPrice = (priceString: string) => {
    const price = Number(priceString.replace(/[^\d.-]/g, ''));
    const formattedPrice =
      isNaN(price) || price === 0 ? '-' : `${price.toLocaleString()}₫`;
    return formattedPrice;
  };

  return (
    <Flex vertical>
      <Flex justify='space-between' align='center' className=''>
        {price.price_type === 'sale' ? (
          <Flex align='center'>
            <Text className='text-[16px] font-semibold text-[#FA6338]'>
              {formattedPrice(price.calculated_price)}
            </Text>
            <Text className='text-[10px] font-normal border-[#FFD9CE] border-[1px] border-solid text-[#FA6338] px-[3px] py-[2px] ml-2'>
              -{price.percentage_diff}%
            </Text>
          </Flex>
        ) : (
          <Text className='text-[16px] font-semibold'>
            {formattedPrice(price.calculated_price)}
          </Text>
        )}

        <Button
          type='default'
          shape='circle'
          icon={<ShoppingCart className='stroke-2' size={20} />}
          className='h-[28px] w-[38px] rounded-[20px] border-black/50'
        />
      </Flex>
    </Flex>
  );
};

export default PreviewPrice;
