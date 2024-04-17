import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import ProductList from '@/modules/products/components/products-list';
import ProductSearch from '@/modules/products/components/product-search';
import { listProducts } from '@/actions/products';

export const metadata: Metadata = {
	title: 'Quản lý sản phẩm',
	description: 'Trang quản lý sản phẩm.',
};

interface Props {
	searchParams: Record<string, unknown>;
}

export default async function Products({ searchParams }: Props) {
	const products = await listProducts(searchParams);
	
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ProductSearch />
			<ProductList data={products} />
		</Flex>
	);
}
