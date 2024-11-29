import { Flex } from '@/components/Flex';
import ListTransaction from '@/modules/warehouse/transactions/templates/list-transactions';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Lấy hàng',
	description: 'Trang quản lý lấy hàng.',
};

interface Props {}

export default async function Transactions({}: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ListTransaction />
		</Flex>
	);
}
