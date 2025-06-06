import { Flex } from '@/components/Flex';
import ListChecker from '@/modules/kiot/warehouse/stock-checker/templates/list-checker';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Kiểm hàng',
	description: 'Trang quản lý kiểm hàng.',
};

interface Props {}

export default async function StokChecker({}: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ListChecker />
		</Flex>
	);
}
