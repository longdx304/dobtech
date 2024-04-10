import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import ProductList from '@/modules/products/components/products-list';
import ProductSearch from '@/modules/products/components/product-search';

export const metadata: Metadata = {
	title: 'Quản lý sản phẩm',
	description: 'Trang quản lý sản phẩm.',
};

export default function Products() {
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ProductSearch />
			<ProductList />
		</Flex>
	);
}
