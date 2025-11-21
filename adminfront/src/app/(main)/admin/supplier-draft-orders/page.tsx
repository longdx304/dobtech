import { Flex } from '@/components/Flex';
import ManageSupplierDraftOrders from '@/modules/admin/supplier-draft-orders/manage-draft-orders';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Quản lý đơn hàng nháp',
	description: 'Trang quản lý đơn hàng nháp',
};

interface Props {}

export default async function SupplierDraftOrders({}: Props) {
	return (
		<Suspense>
			<Flex vertical gap="middle" className="h-full w-full">
				<ManageSupplierDraftOrders />
			</Flex>
		</Suspense>
	);
}
