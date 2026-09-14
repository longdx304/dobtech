'use client';

import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
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
	return <div className="mx-auto max-w-7xl space-y-4 pb-10">
		<div className="mb-1">
			<Title level={3} className="!mb-1">Kế toán</Title>
			<p className="text-sm text-gray-500 mb-0">Đối soát đơn hàng, chia hóa đơn và chuẩn bị hai file MISA QT/TH.</p>
		</div>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
		<div className="flex flex-wrap items-center justify-between gap-3 mb-4">
			<div><Title level={4} className="!mb-1">Danh sách đối soát</Title><p className="text-sm text-gray-500 mb-0">Mở một đơn để quản lý mã thuế, phân bổ và kiểm tra file xuất.</p></div>
			<Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm đơn hàng hoặc khách hàng" className="max-w-sm" />
		</div>
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
		</Card>
	</div>;
}
