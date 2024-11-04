import { Metadata } from 'next';
import React, { Suspense } from 'react';
import CartSkeleton from './skeleton';
import dynamic from 'next/dynamic';

const CartTemplate = dynamic(() => import('@/modules/cart/templates'), {
	loading: () => <CartSkeleton />,
});

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Giỏ hàng',
	description: 'Giỏ hàng của bạn trên CHAMDEP VN',
};

export default async function Cart() {
	return (
		<div className="w-full pt-[6rem] lg:pt-[4rem]">
			<Suspense fallback={<CartSkeleton />}>
				<CartTemplate />
			</Suspense>
		</div>
	);
}
