import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import { SupplierOrderEditProvider } from '@/modules/supplier/components/supplier-order-detail/edit-supplier-order-modal/context';
import SupplierOrdersDetail from '@/modules/supplier/templates/supplier-orders-detail';

export const metadata: Metadata = {
	title: 'Chi tiết đơn hàng từ nhà cung cấp',
	description: 'Trang quản đơn hàng từ nhà cung cấp',
};

interface Props {
	params: { id: string };
}

export default async function SupplierOrderDetailPage({ params }: Props) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<SupplierOrderEditProvider orderId={params.id!}>
				<SupplierOrdersDetail id={params.id} />
			</SupplierOrderEditProvider>
		</Flex>
	);
}
