import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import ManageProduct from '@/modules/products/components/manage-product';

export const metadata: Metadata = {
	title: 'Quản lý sản phẩm',
	description: 'Trang quản lý sản phẩm.',
};

interface Props {
	searchParams: Record<string, unknown>;
}

export default async function Products({ searchParams }: Props) {

	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ManageProduct />
		</Flex>
	);
}
