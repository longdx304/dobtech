import { Flex } from '@/components/Flex';
import KiotStockChecker from '@/modules/warehouse/kiot-stock-checker/templates/list-kiot-checker';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Kiểm hàng',
	description: 'Trang quản lý kiểm hàng KiotViet.',
};

interface Props {}

export default async function StokChecker({}: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<KiotStockChecker />
		</Flex>
	);
}
