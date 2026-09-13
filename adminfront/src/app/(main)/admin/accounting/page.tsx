'use client';

import { Input } from '@/components/Input';
import { Title } from '@/components/Typography';
import { Order } from '@/types/order';
import { ERoutes } from '@/types/routes';
import { Table } from 'antd';
import { useAdminOrders } from 'medusa-react';
import Link from 'next/link';
import { useState } from 'react';

const pageSize = 30;
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export default function AccountingPage() {
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const { orders, count, isLoading } = useAdminOrders({
		q: search || undefined,
		offset: (page - 1) * pageSize,
		limit: pageSize,
		expand: 'customer',
		fields: 'id,display_id,created_at,fulfillment_status,total,customer_id',
	} as any);
	return <div className="space-y-4">
		<div>
			<Title level={3}>Kế toán · Đối soát đơn hàng</Title>
			<p className="text-sm text-gray-600">Chuẩn bị mã khách thuế, chia đơn thành nhiều phần hóa đơn và theo dõi chi phí giao ngoài. Xuất file MISA hai sổ sẽ được nối sau khi kiểm chứng mẫu import.</p>
		</div>
		<Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm đơn hàng hoặc khách hàng" className="max-w-sm" />
		<Table
			rowKey="id"
			loading={isLoading}
			dataSource={(orders ?? []) as Order[]}
			columns={[
				{ title: 'Đơn hàng', dataIndex: 'display_id', render: (_: unknown, order: Order) => <Link href={`${ERoutes.ACCOUNTING}/orders/${order.id}`} className="text-blue-600">#{order.display_id}</Link> },
				{ title: 'Ngày tạo', dataIndex: 'created_at', render: (value: string) => new Date(value).toLocaleDateString('vi-VN') },
				{ title: 'Khách quản trị', render: (_: unknown, order: Order) => [order.customer?.last_name, order.customer?.first_name].filter(Boolean).join(' ') || order.email },
				{ title: 'Mã quản trị', render: (_: unknown, order: Order) => (order.customer as any)?.customer_code ?? '' },
				{ title: 'Trạng thái giao', dataIndex: 'fulfillment_status' },
				{ title: 'Tổng đơn', dataIndex: 'total', render: (value: number) => money.format(value ?? 0) },
			]}
			pagination={{ current: page, pageSize, total: count ?? 0, onChange: setPage }}
			scroll={{ x: 850 }}
		/>
	</div>;
}
