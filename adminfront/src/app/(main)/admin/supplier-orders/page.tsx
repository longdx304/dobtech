import { Flex } from '@/components/Flex';
import ManageSupplierOrders from '@/modules/admin/supplier-orders/templates/manage-sorder';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Quản lý đơn đặt hàng',
	description: 'Trang quản lý đơn đặt hàng',
};

interface Props {}

export default async function SupplierOrders({}: Props) {
	return (
		<Suspense>
			<Flex vertical gap="middle" className="h-full w-full">
				<ManageSupplierOrders />
			</Flex>
		</Suspense>
	);
}
