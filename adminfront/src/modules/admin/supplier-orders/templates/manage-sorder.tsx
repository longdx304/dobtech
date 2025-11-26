'use client';
import { Card } from '@/components/Card';
import { FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsProps } from 'antd';
import SupplierOrdersList from './supplier-orders-list';
import SupplierDraftOrderList from '../../supplier-draft-orders/templates/draft-sorders';

type Props = {
	initialTab?: string;
};

const ManageSupplierOrders: FC<Props> = ({initialTab = 'supplier-orders'}: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = searchParams.get('tab') || initialTab;

	const itemsTab: TabsProps['items'] = [
		{
			key: 'supplier-orders',
			label: 'Đơn hàng',
			children: <SupplierOrdersList />,
		},
		{
			key: 'supplier-draft-orders',
			label: 'Bản nháp',
			children: <SupplierDraftOrderList />,
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

export default ManageSupplierOrders;
