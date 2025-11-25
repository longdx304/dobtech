'use client';
import { Card } from '@/components/Card';
import { Tabs } from '@/components/Tabs';
import { type TabsProps } from 'antd';
import { FC } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import SupplierDraftOrderList from './templates/draft-sorders';
import SupplierOrdersList from '../supplier-orders/templates/supplier-orders-list';

type Props = {}; 


const ManageSupplierDraftOrders: FC<Props> = ({}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = searchParams.get('tab') || 'supplier-draft-orders';

	const itemsTab: TabsProps['items'] = [
		{
			key: 'supplier-orders',
			label: 'Đơn đặt hàng',
			children: <SupplierOrdersList />,
		},
		{
			key: 'supplier-draft-orders',
			label: 'Bản nháp',
			children: <SupplierDraftOrderList />,
		},
	];

	// Handle tab change to update the route with the selected tab
	const handleTabChange = (key: string) => {
		router.push(`/admin/${key}`);
	};

	return (
		<Card className="w-full" bordered={false}>
			<Tabs items={itemsTab} activeKey={query} onChange={handleTabChange} type="card" centered />
		</Card>
	);
};

export default ManageSupplierDraftOrders;
