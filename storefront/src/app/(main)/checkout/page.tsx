import { Metadata } from 'next';
import React, { Suspense } from 'react';
import CheckoutSkeleton from './skeleton';

const CheckoutTemplate = React.lazy(
	() => import('@/modules/checkout/templates')
);

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Thanh toán',
	description: 'Thanh toán mua hàng',
};

export default async function Checkout({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	return (
		<div className="w-full pt-[4rem] lg:pt-[4rem]">
			<Suspense fallback={<CheckoutSkeleton />}>
				<CheckoutTemplate params={searchParams} />
			</Suspense>
		</div>
	);
}
