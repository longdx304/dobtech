import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import CheckoutSkeleton from './skeleton';

const CheckoutTemplate = dynamic(() => import('@/modules/checkout/templates'), {
	loading: () => <CheckoutSkeleton />,
});

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
