// 'use client';
import { FC } from 'react';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import useScrollDirection from '@/lib/hooks/useScrollDirection';
import { cn } from '@/lib/utils';
import { TTreeCategories } from '@/types/productCategory';
import Category from './Category';
import HeaderWrap from './HeaderWrap';

interface Props {
  categories: TTreeCategories[] | null;
}

const Header: FC<Props> = ({ categories }) => {
  // const { state, onClose, onOpen } = useToggleState(false);
  // const scrollDirection = useScrollDirection();

  return (
    <Card
      className={cn(
        'fixed top-0 w-full shadow px-0 pt-2 pb-0 rounded-none transition-all ease-in-out duration-300 z-10',
        // "sm:w-[200px] md:w-[250px] sm:h-full sm:[&_.ant-card-body]:px-0",
        // scrollDirection === 'up' ? 'translate-y-0' : '-translate-y-24'
      )}
      bordered={false}
    >
      <Flex vertical className='container'>
        <HeaderWrap />
        <Category categories={categories} />
      </Flex>
    </Card>
  );
};

export default Header;
