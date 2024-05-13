import { Metadata } from 'next';

import { Flex } from '@/components/Flex';
import ProductDetail from '@/modules/products/components/product-detail';
import { listCategories } from '@/actions/productCategories';

export const metadata: Metadata = {
	title: 'Chi tiết sản phẩm',
	description: 'Trang quản lý sản phẩm.',
};

interface Props {
	params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
	const productCategories = await listCategories();
	return (
		<Flex vertical gap="middle" className="h-full w-full">
			<ProductDetail id={params.id} productCategories={productCategories} />
		</Flex>
	);
}
