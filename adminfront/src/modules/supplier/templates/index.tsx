'use client';

import { Card } from '@/components/Card';
import { Tabs } from '@/components/Tabs';
import { TabsProps } from 'antd';
import { FC } from 'react';
import SupplierOrdersList from './supplier-orders/supplier-orders-list';
import SupplierList from './supplier/supplier-list';

type Props = {};

const ManageSupplier: FC<Props> = ({}) => {
	const itemTabs: TabsProps['items'] = [
		{
			key: 'supplier-orders',
			label: 'Đơn đặt hàng',
			children: <SupplierOrdersList />,
		},
		{
			key: 'suppliers',
			label: 'Nhà cung cấp',
			children: <SupplierList />,
		},
	];
	return (
		<Card className="w-full" bordered={false}>
			<Tabs items={itemTabs} />
		</Card>
	);
};

export default ManageSupplier;
