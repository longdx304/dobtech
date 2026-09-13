'use client';

import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import CustomerInvoiceProfiles from '@/modules/admin/customers/components/edit-customer-modal/customer-invoice-profiles';
import InvoiceParts from '@/modules/admin/orders/components/orders/invoice-parts';
import ExternalDeliveryCosts from '@/modules/admin/orders/components/orders/external-delivery-costs';
import { Order } from '@/types/order';
import { ERoutes } from '@/types/routes';
import { useAdminOrder } from 'medusa-react';
import Link from 'next/link';

export default function AccountingOrderPage({ params }: { params: { id: string } }) {
	const { order, isLoading } = useAdminOrder(params.id, {
		expand: 'customer,items,items.variant',
	});
	const customer = order?.customer as ({ first_name?: string | null; last_name?: string | null; customer_code?: string | null }) | undefined;
	return <div className="space-y-4 pb-10">
		<Link href={ERoutes.ACCOUNTING} className="text-blue-600">← Danh sách đối soát</Link>
		{isLoading && <div>Đang tải đơn hàng...</div>}
		{order && <>
			<Card bordered={false}>
				<Title level={3}>Đơn hàng #{order.display_id}</Title>
				<div className="text-sm">Khách quản trị: {[customer?.last_name, customer?.first_name].filter(Boolean).join(' ') || order.email} · Mã: {customer?.customer_code || 'Chưa có mã'}</div>
			</Card>
			<Card bordered={false}><CustomerInvoiceProfiles customerId={order.customer_id} enabled /></Card>
			<InvoiceParts order={order as Order} />
			<ExternalDeliveryCosts orderId={order.id} />
		</>}
	</div>;
}
