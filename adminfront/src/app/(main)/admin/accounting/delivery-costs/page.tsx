'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import { useQuery } from '@tanstack/react-query';
import { Input, Select, Table, message } from 'antd';
import dayjs from 'dayjs';
import { useMedusa } from 'medusa-react';
import Link from 'next/link';
import { useState } from 'react';
import * as XLSX from 'xlsx';

type Payer = 'company' | 'customer' | 'all';
type CostRow = {
	id: string;
	order_id: string;
	display_id: number;
	management_customer_code: string | null;
	customer_name: string;
	sales_person: string;
	provider: string;
	amount: number;
	paid_by: string;
	delivery_date: string;
	reference: string | null;
	order_total: number;
	percent_of_order: number | null;
};
type SummaryRow = { amount: number; share_percent: number; customer_code?: string; customer_name?: string; sales_person?: string };
type OrderSummaryRow = { order_id: string; display_id: number; customer_code: string; customer_name: string; amount: number; order_total: number; percent_of_order: number | null };
type Report = { rows: CostRow[]; total_amount: number; by_customer: SummaryRow[]; by_sales_person: SummaryRow[]; by_order: OrderSummaryRow[] };
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const percent = (value: number | null) => value === null ? '—' : `${value.toFixed(2)}%`;

export default function DeliveryCostsReportPage() {
	const { client } = useMedusa();
	const [from, setFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
	const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'));
	const [paidBy, setPaidBy] = useState<Payer>('company');
	const { data, isLoading, error } = useQuery({
		queryKey: ['external-delivery-report', from, to, paidBy],
		queryFn: () => client.admin.custom.get(`/admin/accounting/external-delivery-report?${new URLSearchParams({ from, to, paid_by: paidBy })}`) as Promise<Report>,
		enabled: Boolean(from && to && from <= to),
	});
	const rows = data?.rows ?? [];
	const exportExcel = () => {
		if (!data || !rows.length) {
			message.info('Không có số liệu để xuất');
			return;
		}
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows.map((row) => ({
			'Ngày giao': row.delivery_date,
			'Đơn hàng': row.display_id,
			'Mã khách quản trị': row.management_customer_code,
			'Khách hàng': row.customer_name,
			'Sale phụ trách': row.sales_person,
			'Đơn vị giao': row.provider,
			'Chi phí': row.amount,
			'Bên chịu phí': row.paid_by,
			'Tổng đơn': row.order_total,
			'% chuyến / đơn': row.percent_of_order,
			'Mã chuyến': row.reference,
		}))), 'Chi tiết');
		XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.by_customer), 'Theo khách hàng');
		XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.by_sales_person), 'Theo sale');
		XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.by_order), 'Theo đơn');
		XLSX.writeFile(workbook, `Chi_phi_giao_ngoai_${from}_${to}.xlsx`);
	};
	return <div className="mx-auto max-w-7xl space-y-4 pb-10">
		<div>
			<Title level={3} className="!mb-1">Chi phí giao ngoài</Title>
			<p className="text-sm text-gray-500 mb-0">Theo dõi chi phí theo ngày giao, khách quản trị và sale phụ trách.</p>
		</div>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
		<div className="flex flex-wrap items-end gap-3">
			<div><label className="block text-sm mb-1">Từ ngày</label><Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></div>
			<div><label className="block text-sm mb-1">Đến ngày</label><Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></div>
			<div><label className="block text-sm mb-1">Bên chịu phí</label><Select className="w-40" value={paidBy} onChange={setPaidBy} options={[{ value: 'company', label: 'Công ty' }, { value: 'customer', label: 'Khách hàng' }, { value: 'all', label: 'Tất cả' }]} /></div>
			<Button onClick={exportExcel} disabled={!rows.length}>Xuất Excel</Button>
		</div>
		{Boolean(error) && <div className="text-sm text-red-600">Không tải được báo cáo. Hãy chọn khoảng ngày ngắn hơn hoặc thử lại.</div>}
		<div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm"><span className="text-gray-500">Tổng chi phí theo bộ lọc</span><div className="text-xl font-semibold mt-1">{money.format(data?.total_amount ?? 0)}</div></div>
		</Card>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
		<Title level={4}>Theo khách hàng</Title>
		<Table rowKey={(row) => row.customer_code || row.customer_name || 'unknown'} loading={isLoading} dataSource={data?.by_customer ?? []} pagination={{ pageSize: 20 }} columns={[
			{ title: 'Mã quản trị', dataIndex: 'customer_code' },
			{ title: 'Khách hàng', dataIndex: 'customer_name' },
			{ title: 'Chi phí', dataIndex: 'amount', render: (value: number) => money.format(value) },
			{ title: '% tổng chi phí', dataIndex: 'share_percent', render: percent },
		]} />
		</Card>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
		<Title level={4}>Theo sale</Title>
		<Table rowKey="sales_person" loading={isLoading} dataSource={data?.by_sales_person ?? []} pagination={{ pageSize: 20 }} columns={[
			{ title: 'Sale', dataIndex: 'sales_person' },
			{ title: 'Chi phí', dataIndex: 'amount', render: (value: number) => money.format(value) },
			{ title: '% tổng chi phí', dataIndex: 'share_percent', render: percent },
		]} />
		</Card>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
		<Title level={4}>Theo đơn hàng</Title>
		<Table rowKey="order_id" loading={isLoading} dataSource={data?.by_order ?? []} pagination={{ pageSize: 20 }} columns={[
			{ title: 'Đơn', render: (_: unknown, row: OrderSummaryRow) => <Link href={`/admin/accounting/orders/${row.order_id}`} className="text-blue-600">#{row.display_id}</Link> },
			{ title: 'Mã quản trị', dataIndex: 'customer_code' },
			{ title: 'Khách hàng', dataIndex: 'customer_name' },
			{ title: 'Chi phí giao ngoài', dataIndex: 'amount', render: (value: number) => money.format(value) },
			{ title: 'Tổng đơn', dataIndex: 'order_total', render: (value: number) => money.format(value) },
			{ title: '% chi phí / đơn', dataIndex: 'percent_of_order', render: percent },
		]} scroll={{ x: 760 }} />
		</Card>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
		<Title level={4}>Chi tiết chuyến giao</Title>
		<Table rowKey="id" loading={isLoading} dataSource={rows} pagination={{ pageSize: 30 }} scroll={{ x: 900 }} columns={[
			{ title: 'Ngày giao', dataIndex: 'delivery_date' },
			{ title: 'Đơn', render: (_: unknown, row: CostRow) => <Link href={`/admin/accounting/orders/${row.order_id}`} className="text-blue-600">#{row.display_id}</Link> },
			{ title: 'Khách hàng', dataIndex: 'customer_name' },
			{ title: 'Sale', dataIndex: 'sales_person' },
			{ title: 'Đơn vị', dataIndex: 'provider' },
			{ title: 'Chi phí', dataIndex: 'amount', render: (value: number) => money.format(value) },
			{ title: '% chuyến / đơn', dataIndex: 'percent_of_order', render: percent },
		]} />
		</Card>
	</div>;
}
