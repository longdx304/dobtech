'use client';
import { Card } from '@/components/Card';
import { FC } from 'react';
import OrderList from './orders';
import DraftOrderList from '@/modules/admin/draft-orders/templates/draft-orders';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsProps } from 'antd';

type Props = {
	initialTab?: string;
};

const ManageOrders: FC<Props> = ({initialTab = 'orders'}: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = searchParams.get('tab') || initialTab;

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

	const handleTabChange = (key: string) => {
		router.push(`/admin/${key}`);
	};

	return (
		<Card className="w-full" bordered={false}>
			<Tabs items={itemsTab} activeKey={query} onChange={handleTabChange} type="card" centered />
		</Card>
	);
};

export default ManageOrders;
