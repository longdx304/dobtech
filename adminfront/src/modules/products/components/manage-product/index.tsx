'use client';
import { FC } from 'react';
import { type TabsProps } from 'antd';

import { Product } from '@medusajs/medusa';
import { Card } from '@/components/Card';
import { Tabs } from '@/components/Tabs';
import ProductList from '@/modules/products/components/products-list';
import CollectionList from '@/modules/products/components/collection-list';

type Props = {};

const ManageProduct: FC<Props> = ({}) => {
	const itemsTab: TabsProps['items'] = [
		{
			key: 'products',
			label: 'Sản phẩm',
			// children: <div>Product</div>,
			children: <ProductList />,
		},
		{
			key: 'collections',
			label: 'Bộ sưu tập',
			children: <CollectionList />,
		},
	];
	return (
		<Card className="w-full" bordered={false}>
			<Tabs items={itemsTab} />
		</Card>
	);
};

export default ManageProduct;
