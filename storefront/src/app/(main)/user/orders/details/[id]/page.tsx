import { retrieveOrder } from '@/actions/cart';
import OrderDetailsTemplate from '@/modules/order/templates/order-details-template';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
	params: { id: string };
};

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Chi tiết đơn hàng của bạn',
	description: 'Xem chi tiết đơn hàng của bạn',
};

export default async function OrderDetailPage({ params }: Props) {
	const order = await retrieveOrder(params.id).catch(() => null);

	if (!order) {
		notFound();
	}

	return <OrderDetailsTemplate order={order} />;
}
