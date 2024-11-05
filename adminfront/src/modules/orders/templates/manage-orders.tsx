'use client';
import { Card } from '@/components/Card';
import { Tabs } from '@/components/Tabs';
import { type TabsProps } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';
import DraftOrderList from '../../draft-orders/templates/draft-orders';
import OrderList from './orders';

type Props = {};

const ManageOrders: FC<Props> = ({}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = searchParams.get('tab') || 'orders';

	const itemsTab: TabsProps['items'] = [
		{
			key: 'orders',
			label: 'Đơn hàng',
			children: <OrderList />,
		},
		{
			key: 'draft-orders',
			label: 'Bản nháp',
			children: <DraftOrderList />,
		},
	];

	// Handle tab change to update the route with the selected tab
	const handleTabChange = (key: string) => {
		router.push(`/admin/${key}`);
	};

	return (
		<Card className="w-full" bordered={false}>
			<Tabs items={itemsTab} activeKey={query} onChange={handleTabChange} />
		</Card>
	);
};

export default ManageOrders;
