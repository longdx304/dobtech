import { retrieveOrder } from '@/actions/cart';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const OrderDetailsTemplate = dynamic(
	() => import('@/modules/order/templates/order-details-template')
);

type Props = {
	params: { id: string };
};

export const metadata: Metadata = {
	title: 'SYNA | Chi tiết đơn hàng của bạn',
	description: 'Xem chi tiết đơn hàng của bạn',
};

export default async function OrderDetailPage({ params }: Props) {
	const order = await retrieveOrder(params.id).catch(() => null);

	if (!order) {
		notFound();
	}

	return <OrderDetailsTemplate order={order} />;
}
