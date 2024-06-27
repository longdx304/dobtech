import { Metadata } from 'next';
import React, { Suspense } from 'react';

const CheckoutTemplate = React.lazy(
	() => import('@/modules/checkout/templates')
);

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Thanh toán',
	description: 'Thanh toán đơn hàng của bạn trên CHAMDEP VN',
};

export default async function Checkout() {
	return (
		<div className="w-full pt-[6rem] lg:pt-[4rem]">
			<Suspense fallback={<p>Loading feed...</p>}>
				<CheckoutTemplate />
			</Suspense>
		</div>
	);
}
