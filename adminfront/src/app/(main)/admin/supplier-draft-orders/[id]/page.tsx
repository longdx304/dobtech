import { Metadata } from 'next';
import { Flex } from '@/components/Flex';
import SupplierDraftOrderDetail from '@/modules/admin/supplier-draft-orders/templates/draft-order-detail';

export const metadata: Metadata = {
	title: 'Chi tiết bản nháp đơn đặt hàng',
	description: 'Trang quản lý bản nháp đơn đặt hàng từ nhà cung cấp',
};

interface Props {
	params: { id: string };
}

export default async function SupplierDraftOrderDetailPage({
	params,
}: Readonly<Props>) {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<SupplierDraftOrderDetail id={params.id} />
		</Flex>
	);
}

