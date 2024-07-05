import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import OrderDetail from '@/modules/orders/templates/order-detail';

export const metadata: Metadata = {
	title: 'Chi tiết đơn hàng',
	description: 'Trang quản đơn hàng.',
};

interface Props {
	params: { id: string };
}

export default async function OrderDetailPage({ params }: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<OrderDetail id={params.id} />
		</Flex>
	);
}
