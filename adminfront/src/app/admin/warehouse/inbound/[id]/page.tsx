import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import InboundDetail from '@/modules/warehouse/inbound/templates/inbound-detail';

export const metadata: Metadata = {
	title: 'Chi tiết nhập hàng',
	description: 'Trang quản lý nhập hàng.',
};

interface Props {
	params: { id: string };
}

export default async function InboundDetailPage({ params }: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<InboundDetail id={params.id} />
		</Flex>
	);
}