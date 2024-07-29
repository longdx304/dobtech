import { Flex } from '@/components/Flex';
import ManageOrders from '@/modules/orders/templates/manage-orders';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Quản lý đơn hàng',
	description: 'Trang quản lý đơn hàng',
};

interface Props {}

export default async function Orders({}: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ManageOrders />
		</Flex>
	);
}

