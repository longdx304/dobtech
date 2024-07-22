import { listCustomerOrders } from '@/actions/customer';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import OrderOverview from '@/modules/user/components/order-overview';
import { Metadata } from 'next';

import { notFound } from 'next/navigation';

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Đơn đặt mua',
	description: 'Đơn đặt mua của bạn',
};

export default async function Orders() {
	const orders = await listCustomerOrders();

	if (!orders) {
		notFound();
	}

	return (
		<div className="w-full" data-testid="orders-page-wrapper">
			<OrderOverview orders={orders} />
		</div>
	);
}
