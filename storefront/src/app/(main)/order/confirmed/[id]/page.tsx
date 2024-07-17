import { retrieveOrder } from '@/actions/cart';
import { enrichLineItems } from '@/modules/cart/action';
import { LineItem, Order } from '@medusajs/medusa';
import { Metadata } from 'next';

import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import OrderSkeleton from './skeleton';

const OrderCompletedTemplate = React.lazy(
	() => import('@/modules/order/templates/order-completed-template')
);

type Props = {
	params: { id: string };
};

async function getOrder(id: string) {
	const order = await retrieveOrder(id);

	if (!order) {
		return notFound();
	}

	const enrichedItems = await enrichLineItems(order.items, order.region_id);

	return {
		order: {
			...order,
			items: enrichedItems as LineItem[],
		} as Order,
	};
}

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Đơn hàng thanh toán',
	description: 'Đơn hàng của bạn thanh toán thành công',
};

export default async function OrderConfirmedPage({ params }: Props) {
	const { order } = await getOrder(params.id);

	return (
		<div className="w-full pt-[6rem] lg:pt-[4rem]">
			<Suspense fallback={<OrderSkeleton />}>
				<OrderCompletedTemplate order={order} />;
			</Suspense>
		</div>
	);
}
