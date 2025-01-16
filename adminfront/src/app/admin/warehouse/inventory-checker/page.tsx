import { Flex } from '@/components/Flex';
import ListShipment from '@/modules/warehouse/shipment/templates/list-shipment';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Quản lý kho hàng',
	description: 'Trang quản lý kho hàng.',
};

interface Props {}

export default async function Ship({}: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ListShipment />
		</Flex>
	);
}
