import { Metadata } from 'next';
import React, { Suspense } from 'react';
import CartSkeleton from './skeleton';

// import CartTemplate from '@/modules/cart/templates';
const CartTemplate = React.lazy(() => import('@/modules/cart/templates'));

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Giỏ hàng',
	description: 'Giỏ hàng của bạn trên CHAMDEP VN',
};

export default async function Cart() {

	return (
		<div className="w-full pt-[6rem] lg:pt-[4rem]">
			<Suspense fallback={<CartSkeleton />}>
				<CartTemplate	/>
			</Suspense>
		</div>
	);
}


