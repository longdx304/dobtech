import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import KiotCheckerDetail from '@/modules/warehouse/kiot-stock-checker/templates/kiot-checker-detail';

export const metadata: Metadata = {
	title: 'Chi tiết kiểm hàng',
	description: 'Trang quản lý kiểm hàng KiotViet.',
};

interface Props {
	params: { id: string };
}

export default async function StockDetailPage({ params }: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<KiotCheckerDetail id={params.id} />
		</Flex>
	);
}
