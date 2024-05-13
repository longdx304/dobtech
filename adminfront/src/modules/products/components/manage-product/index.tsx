'use client';
import { FC } from 'react';
import { type TabsProps } from 'antd';

import { Product } from '@medusajs/medusa';
import { Card } from '@/components/Card';
import { ProductList } from '@/modules/products/components/products-list';
import CollectionList from '@/modules/products/components/collection-list';
import { Tabs } from '@/components/Tabs';

type Props = {};

const ManageProduct: FC<Props> = ({}) => {
	const itemsTab: TabsProps['items'] = [
		{
			key: 'products',
			label: 'Sản phẩm',
			children: <div>Product</div>,
			// children: <ProductList data={products} categories={productCategories} />,
		},
		{
			key: 'collections',
			label: 'Bộ sưu tập',
			children: <CollectionList />,
			// children: <ProductList data={products} categories={productCategories} />,
		},
	];
	return (
		<Card className="w-full" bordered={false}>
			<Tabs type="card" items={itemsTab} />
		</Card>
	);
};

export default ManageProduct;
