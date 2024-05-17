import { FC, Suspense } from 'react';

import { BadgeButton } from '@/components/Button';
import CartButton from '@/modules/layout/components/cart-button';
import { Flex, Input } from 'antd';
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
            src='/images/dob-icon.png'
            width={28}
            height={37}
            alt='Dob Icon'
          />
        </LocalizedClientLink>
      </div>
      <Flex gap='small' justify='center' align='center'>
        <Suspense
          fallback={
            <LocalizedClientLink
              className='hover:text-ui-fg-base flex gap-2'
              href='cart'
              data-testid='nav-cart-link'
            >
              {/* <Search
                className='[&_.ant-input-outlined:focus]:shadow-none'
                placeholder='Tìm kiếm'
                // onSearch={() => {}}
                enterButton
              /> */}
            </LocalizedClientLink>
          }
        >
          {/* <Search
            className='[&_.ant-input-outlined:focus]:shadow-none'
            placeholder='Tìm kiếm'
            // onSearch={() => {}}
            enterButton
          /> */}
          Search
        </Suspense>
        {/* <BadgeButton
          icon={<ShoppingCart className='stroke-2' />}
          count={0}
          showZero
          offset={[0, 10]}
        /> */}
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

        {/* User */}
        <Suspense
          fallback={
            <LocalizedClientLink
              className='hover:text-ui-fg-base flex gap-2'
              href='cart'
              data-testid='nav-cart-link'
            >
              {/* <Button
                icon={<User className='stroke-2' />}
                shape='circle'
                type='text'
                onClick={() => {}}
                className=''
              /> */}
            </LocalizedClientLink>
          }
        >
          {/* <Button
            icon={<User className='stroke-2' />}
            shape='circle'
            type='text'
            onClick={() => {}}
            className=''
          /> */}
          User
        </Suspense>
      </Flex>
    </Flex>
  );
};

export default HeaderWrap;
