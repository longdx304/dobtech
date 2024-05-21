import { FC } from 'react';
import { ShoppingCart } from 'lucide-react';

import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { Button } from '@/components/Button';
import { ProductPreviewType } from '@/types/product';

interface Props {
  price: ProductPreviewType['price'];
}

const PreviewPrice: FC<Props> = ({ price }) => {
  const calculatedPrice = Number(
    price?.calculated_price.replace(/[^\d.-]/g, '')
  );

  const formattedPrice =
    isNaN(calculatedPrice) || calculatedPrice === 0
      ? '-'
      : `₫${calculatedPrice.toLocaleString()}`;

  return (
    <Flex justify='space-between' align='center' className=''>
      <Text className='text-[0.875rem] font-semibold'>{formattedPrice}</Text>
      <Button
        type='text'
        shape='circle'
        icon={<ShoppingCart className='stroke-2' />}
      />
    </Flex>
  );
};

export default PreviewPrice;
