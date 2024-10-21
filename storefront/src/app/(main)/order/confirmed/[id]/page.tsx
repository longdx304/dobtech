import { retrieveOrder } from '@/actions/cart';
import { enrichLineItems } from '@/modules/cart/action';
import { LineItem, Order } from '@medusajs/medusa';
import { Metadata } from 'next';

import { deletePaymentSession } from '@/actions/checkout';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import OrderSkeleton from './skeleton';

const OrderCompletedTemplate = dynamic(
	() => import('@/modules/order/templates/order-completed-template'),
	{
		loading: () => <OrderSkeleton />,
	}
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

	const cart = await deletePaymentSession(order?.cart_id, 'manual');

	if (!cart) {
		return null;
	}

	return (
		<div className="w-full pt-[4rem] lg:pt-[4rem]">
			<Suspense fallback={<OrderSkeleton />}>
				<OrderCompletedTemplate order={order} />;
			</Suspense>
		</div>
	);
}
