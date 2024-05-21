import { FC, Suspense } from 'react';

import { BadgeButton } from '@/components/Button';
import CartButton from '@/modules/layout/components/cart-button';
import SearchInput from '@/modules/layout/components/search-input.tsx';
import UserInformation from '@/modules/layout/components/user-information';
import { Flex } from 'antd';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import LocalizedClientLink from '../localized-client-link';

interface Props {}

const HeaderWrap: FC<Props> = ({}) => {
  return (
    <Flex className='w-full' justify='space-between' align='center'>
      <div className='flex items-center'>
        <LocalizedClientLink href='/'>
          <Image
            src='/images/CHAMDEP_logo.png'
            width={125}
            height={48}
            alt='Dob Icon'
          />
        </LocalizedClientLink>
      </div>
      <Flex gap='small' justify='center' align='center'>
        {/* Search */}
        <Suspense>
          <SearchInput />
        </Suspense>

        {/* Cart */}
        <Suspense
          fallback={
            <LocalizedClientLink
              className='hover:text-ui-fg-base flex gap-2'
              href='cart'
              data-testid='nav-cart-link'
            >
              <BadgeButton
                icon={<ShoppingCart className='stroke-2' />}
                count={0}
                showZero
                offset={[0, 10]}
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
