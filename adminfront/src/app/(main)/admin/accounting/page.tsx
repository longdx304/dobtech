'use client';

import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import { Order } from '@/types/order';
import { ERoutes } from '@/types/routes';
import { DatePicker, Space, Table, message } from 'antd';
import { useAdminOrders, useMedusa } from 'medusa-react';
import Link from 'next/link';
import { useState } from 'react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { buildDualBookRows, InvoicePartForExport, InvoiceReconciliationForExport } from '@/modules/admin/orders/components/orders/export-excel/dual-books';
import { getErrorMessage } from '@/lib/utils';

const pageSize = 30;
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export default function AccountingPage() {
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [postingDate, setPostingDate] = useState(dayjs().format('YYYY-MM-DD'));
	const [exporting, setExporting] = useState(false);
	const { client } = useMedusa();
	const { orders, count, isLoading } = useAdminOrders({
		q: search || undefined,
		offset: (page - 1) * pageSize,
		limit: pageSize,
		expand: 'customer',
		fields: 'id,display_id,created_at,fulfillment_status,total,customer_id',
	} as any);
	const exportSelected = async () => {
		if (!selectedRowKeys.length) {
			message.warning('Chọn ít nhất một đơn đã hoàn thành hoặc đã giao');
			return;
		}
		setExporting(true);
		try {
			const managementRows: any[] = [];
			const taxRows: any[] = [];
			for (const orderId of selectedRowKeys.map(String)) {
				const response = await client.admin.orders.retrieve(orderId, {
					expand: 'customer,items,items.variant,shipping_methods,discounts',
				} as any);
				const order = response.order as unknown as Order;
				const partsResponse = await client.admin.custom.get(`/admin/orders/${orderId}/invoice-parts`) as { parts: InvoicePartForExport[] };
				if (!partsResponse.parts.length) {
					throw new Error(`Đơn #${order.display_id}: chưa có phân bổ xuất hóa đơn`);
				}
				if (partsResponse.parts.some((part) => !part.is_issued || !part.invoice_date)) {
					throw new Error(`Đơn #${order.display_id}: còn phần hóa đơn chưa xác nhận ngày phát hành`);
				}
				const reconciliationResponse = await client.admin.custom.get(`/admin/orders/${orderId}/invoice-parts/reconciliation`) as { reconciliation: InvoiceReconciliationForExport };
				const settings = {
					postingDate,
					items: Object.fromEntries((order.items ?? []).map((item) => [item.id, {
						unit: 'Đôi', managementWarehouse: 'KHH-HCM', taxWarehouse: 'KHODEPNKTHAI', taxRate: 8,
					}])),
				};
				try {
					const result = buildDualBookRows(order, partsResponse.parts, reconciliationResponse.reconciliation, settings);
					managementRows.push(...result.managementRows);
					taxRows.push(...result.taxRows);
				} catch (error) {
					throw new Error(`Đơn #${order.display_id}: ${getErrorMessage(error)}`);
				}
			}
			const write = (rows: any[], book: 'QT' | 'TH') => {
				const workbook = XLSX.utils.book_new();
				const sheet = XLSX.utils.json_to_sheet(rows, { cellDates: true });
				for (let rowIndex = 2; rowIndex <= rows.length + 1; rowIndex += 1) {
					for (const column of ['H', 'I', 'P']) {
						const cell = sheet[`${column}${rowIndex}`];
						if (cell?.t === 'd') cell.z = 'dd/mm/yyyy';
					}
				}
				XLSX.utils.book_append_sheet(workbook, sheet, 'Đơn hàng');
				XLSX.writeFile(workbook, `${book}_Tong_hop_${postingDate}_${selectedRowKeys.length}_don.xlsx`);
			};
			write(managementRows, 'QT');
			write(taxRows, 'TH');
				message.success(`Đã tạo 2 file thử QT/TH tổng hợp từ ${selectedRowKeys.length} đơn`);
		} catch (error) {
			message.error(getErrorMessage(error), 8);
		} finally {
			setExporting(false);
		}
	};
	return <div className="mx-auto max-w-7xl space-y-4 pb-10">
		<div className="mb-1">
			<Title level={3} className="!mb-1">Kế toán</Title>
			<p className="text-sm text-gray-500 mb-0">Đối soát đơn hàng, chia hóa đơn và chuẩn bị hai file MISA QT/TH.</p>
		</div>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
		<div className="flex flex-wrap items-center justify-between gap-3 mb-4">
			<div><Title level={4} className="!mb-1">Danh sách đối soát</Title><p className="text-sm text-gray-500 mb-0">Mở một đơn để quản lý mã thuế, phân bổ và kiểm tra file xuất.</p></div>
			<Space wrap>
				<Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm đơn hàng hoặc khách hàng" className="w-64" />
				<DatePicker value={dayjs(postingDate)} onChange={(value) => setPostingDate(value?.format('YYYY-MM-DD') ?? '')} allowClear={false} placeholder="Ngày chứng từ" />
				<Button type="primary" loading={exporting} disabled={!selectedRowKeys.length} onClick={exportSelected}>Tạo file thử QT/TH ({selectedRowKeys.length})</Button>
			</Space>
		</div>
		<div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-gray-700">Chọn các đơn đã hoàn thành trong ngày, sau đó tạo một file QT và một file TH tổng hợp. Hệ thống chặn toàn bộ lượt xuất nếu có đơn chưa phát hành, chưa phân đủ hoặc lệch tiền. Bản thử hiện dùng mặc định ĐVT Đôi, kho QT KHH-HCM, kho TH KHODEPNKTHAI và VAT 8%; đơn có cấu hình khác cần xuất riêng để kiểm tra.</div>
		<Table
			rowKey="id"
			loading={isLoading}
			dataSource={(orders ?? []) as Order[]}
			rowSelection={{
				selectedRowKeys,
				onChange: setSelectedRowKeys,
				getCheckboxProps: (order: Order) => ({ disabled: !['fulfilled', 'shipped'].includes(order.fulfillment_status) }),
			}}
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
