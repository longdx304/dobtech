'use client';
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
      : `${calculatedPrice.toLocaleString()}₫`;

  return (
		<Flex vertical>
			<Flex justify='space-between' align='center' className=''>
				<Text className='text-[1.15rem] font-semibold'>{formattedPrice}</Text>
				<Button
					type='default'
					shape='circle'
					icon={<ShoppingCart className='stroke-2' size={20} />}
					className="h-[28px] w-[38px] rounded-[20px] border-black/50"
				/>
			</Flex>
			{/* <Text className='leading-4 text-[0.875rem]'>{''}</Text> */}
		</Flex>
  );
};

export default PreviewPrice;
