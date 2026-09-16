'use client';

import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import CustomerInvoiceProfiles from '@/modules/admin/customers/components/edit-customer-modal/customer-invoice-profiles';
import InvoiceParts from '@/modules/admin/orders/components/orders/invoice-parts';
import MisaDualExport from '@/modules/admin/orders/components/orders/misa-dual-export';
import { Order } from '@/types/order';
import { ERoutes } from '@/types/routes';
import { Tag } from 'antd';
import { useAdminOrder } from 'medusa-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AccountingOrderPage({ params }: { params: { id: string } }) {
	const [allocationDirty, setAllocationDirty] = useState(false);
	const { order, isLoading } = useAdminOrder(params.id, {
		expand: 'customer,items,items.variant',
	});
	const customer = order?.customer as ({ first_name?: string | null; last_name?: string | null; customer_code?: string | null }) | undefined;
	return <div className="mx-auto max-w-7xl space-y-5 pb-10">
		<Link href={ERoutes.ACCOUNTING} className="inline-flex text-sm text-gray-600 hover:text-blue-600">← Quay lại danh sách đối soát</Link>
		{isLoading && <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Đang tải đơn hàng...</div>}
		{order && <>
			<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
				<div className="flex flex-wrap items-start justify-between gap-2 mb-4">
					<div>
						<Title level={3} className="!mb-1">Đối soát đơn #{order.display_id}</Title>
						<p className="text-sm text-gray-500 mb-0">Quản lý mã khách thuế, phân bổ hóa đơn và chuẩn bị file MISA.</p>
					</div>
					<Tag color={['fulfilled', 'shipped'].includes(order.fulfillment_status) ? 'green' : 'default'}>{order.fulfillment_status === 'shipped' ? 'Đã giao hàng' : order.fulfillment_status === 'fulfilled' ? 'Đã hoàn thành kho' : 'Chưa đủ điều kiện xuất'}</Tag>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
					<div className="rounded-lg bg-gray-50 px-4 py-3"><div className="text-xs text-gray-500 mb-1">Khách quản trị</div><div className="font-medium">{[customer?.last_name, customer?.first_name].filter(Boolean).join(' ') || order.email}</div></div>
					<div className="rounded-lg bg-gray-50 px-4 py-3"><div className="text-xs text-gray-500 mb-1">Mã quản trị</div><div className="font-medium">{customer?.customer_code || 'Chưa có mã'}</div></div>
					<div className="rounded-lg bg-gray-50 px-4 py-3"><div className="text-xs text-gray-500 mb-1">Tổng đơn</div><div className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total ?? 0)}</div></div>
				</div>
			</Card>
			<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered><CustomerInvoiceProfiles customerId={order.customer_id} enabled /></Card>
			<InvoiceParts order={order as Order} onDirtyChange={setAllocationDirty} />
			<MisaDualExport order={order as Order} allocationDirty={allocationDirty} />
		</>}
	</div>;
}
