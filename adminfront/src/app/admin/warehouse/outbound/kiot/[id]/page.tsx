import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import { ProductUnitProvider } from '@/lib/providers/product-unit-provider';
import OutboundKiotDetail from '@/modules/warehouse/kiot-outbound/templates/outbound-detail';

export const metadata: Metadata = {
	title: 'Chi tiết xuất kho kiot',
	description: 'Trang quản lý xuất kho kiot.',
};

interface Props {
	params: { id: string };
}

export default async function OutboundKiotDetailPage({ params }: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ProductUnitProvider _defaultUnit="đôi">
				<OutboundKiotDetail id={params.id} />
			</ProductUnitProvider>
		</Flex>
	);
}
