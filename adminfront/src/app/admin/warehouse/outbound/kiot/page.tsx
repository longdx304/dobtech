import { Flex } from '@/components/Flex';
import ListOutboundKiot from '@/modules/warehouse/kiot-outbound/templates/list-outbound';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Xuất kho Kiot',
	description: 'Trang quản lý xuất kho Kiot.',
};

interface Props {}

export default async function OutboundKiot({}: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ListOutboundKiot />
		</Flex>
	);
}
