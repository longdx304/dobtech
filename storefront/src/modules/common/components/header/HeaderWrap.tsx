import { FC, Suspense } from 'react';

import { BadgeButton } from '@/components/Button';
import CartButton from '@/modules/layout/components/cart-button';
import SearchInput from '@/modules/layout/components/search-input.tsx';
import UserInformation from '@/modules/layout/components/user-information';
import EmailButton from '@/modules/layout/components/email-button';
import { Flex } from 'antd';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import LocalizedClientLink from '../localized-client-link';

interface Props {}

const HeaderWrap: FC<Props> = ({}) => {
  return (
    <Flex className='w-full hidden lg:flex' justify='space-between' align='center'>
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
        <Suspense>
          <SearchInput />
        </Suspense>

        {/* Cart */}
        <Suspense
          fallback={
            <LocalizedClientLink
              className='flex gap-2'
              href='cart'
              data-testid='nav-cart-link'
            >
              <BadgeButton
                icon={<ShoppingCart className='stroke-2' color='#767676' />}
                count={0}
                showZero
                offset={[-10, 10]}
              />
            </LocalizedClientLink>
          }
        >
          <CartButton />
        </Suspense>

        {/* User Information */}
        <Suspense>
          <UserInformation />
        </Suspense>
      </Flex>
    </Flex>
  );
};

export default HeaderWrap;
