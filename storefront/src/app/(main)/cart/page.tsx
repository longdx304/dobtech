import { Metadata } from 'next';

import CartTemplate from '@/modules/cart/templates';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'View your cart',
};

export default async function Cart() {
  return (
    <div className='w-full container pt-[8rem]'>
      <CartTemplate />
    </div>
  );
}
