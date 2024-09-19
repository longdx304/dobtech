import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import ManageSupplier from '@/modules/supplier/templates';

export const metadata: Metadata = {
	title: 'Quản lý nhà cung cấp',
	description: 'Trang quản lý nhà cung cấp',
};


export default function Suppliers() {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ManageSupplier />
		</Flex>
	);
}
