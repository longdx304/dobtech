import { FC } from 'react';

import CartButton from '@/modules/layout/components/cart-button';
import SearchInput from '@/modules/layout/components/search-input.tsx';
import UserInformation from '@/modules/layout/components/user-information';
import { Flex } from 'antd';
import Image from 'next/image';
import LocalizedClientLink from '../localized-client-link';

interface Props {}

const HeaderWrap: FC<Props> = ({}) => {
  return (
    <Flex
      className='w-full hidden lg:flex'
      justify='space-between'
      align='center'
    >
      <div className='items-center'>
        <LocalizedClientLink href='/'>
          <Image
            src='/images/CHAMDEP_logo.png'
            width={125}
            height={48}
            alt='Dob Icon'
          />
        </LocalizedClientLink>
      </div>
      <Flex gap='small' className='justify-end w-full pr-3 lg:pr-0'>
        {/* Search */}
        <SearchInput />
        
        {/* Cart */}
        <CartButton />

        {/* User Information */}
        <UserInformation />
      </Flex>
    </Flex>
  );
};

export default HeaderWrap;
