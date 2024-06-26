'use client';
import { Heart, ShoppingCart } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useProduct } from '@/lib/providers/product/product-provider';
import { useRegion } from '@/lib/providers/region-provider';
import { cn } from '@/lib/utils';
import DrawPriceProduct from './DrawPriceProduct';

interface Props {}

const MenuProductDetail: FC<Props> = ({}) => {
  const { product } = useProduct();
  const { region } = useRegion();
  const { state, onOpen, onClose } = useToggleState(false);

  return (
    <Card
      className={cn(
        'fixed bottom-0 w-full shadow px-0 pt-0 pb-0 rounded-none transition-all ease-in-out duration-300 z-10 h-[50px] block lg:hidden'
      )}
      bordered={false}
    >
      <Flex
        className='box-border py-1 text-[#767676] h-auto px-4'
        justify='space-between'
        align='center'
        gap='middle'
      >
        <Heart size={28} strokeWidth={2} color='#000000' />
        <Button
          disabled={!product || !region}
          className='w-full flex items-center justify-center gap rounded-[4px]'
          icon={<ShoppingCart strokeWidth={2} size={24} color='#ffffff' />}
          onClick={onOpen}
        >
          THÊM VÀO GIỎ HÀNG
        </Button>
      </Flex>
      <DrawPriceProduct
        open={state}
        onClose={onClose}
        product={product!}
        region={region!}
      />
    </Card>
  );
};

export default MenuProductDetail;
