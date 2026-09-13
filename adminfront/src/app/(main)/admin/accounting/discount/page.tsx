'use client';

import { Button } from '@/components/Button';
import { Title } from '@/components/Typography';
import { useQuery } from '@tanstack/react-query';
import { Input, Select, Table, message } from 'antd';
import dayjs from 'dayjs';
import { useMedusa } from 'medusa-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';

type Basis = 'invoice' | 'delivery' | 'warehouse';
type DiscountRow = {
	customer_id: string;
	management_customer_code: string;
	customer_name: string;
	tax_customer_code: string;
	eligible_quantity: number;
	invoice_count: number;
	order_count: number;
};

export default function AccountingDiscountPage() {
	const { client } = useMedusa();
	const [basis, setBasis] = useState<Basis>('invoice');
	const [from, setFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
	const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'));
	const [customerCode, setCustomerCode] = useState('');
	const { data, isLoading } = useQuery({
		queryKey: ['accounting-discount', basis, from, to, customerCode],
		queryFn: async () => {
			const params = new URLSearchParams({ basis, from, to });
			if (customerCode.trim()) params.set('customer_code', customerCode.trim());
			return client.admin.custom.get(`/admin/accounting/discount-eligible?${params}`) as Promise<{ rows: DiscountRow[] }>;
		},
		enabled: Boolean(from && to && from <= to),
	});
	const rows = data?.rows ?? [];
	const byCustomer = Object.values(rows.reduce<Record<string, {
		customer_id: string; management_customer_code: string; customer_name: string;
		eligible_quantity: number; invoice_count: number; tax_codes: string[];
	}>>((result, row) => {
		const current = result[row.customer_id] ?? {
			customer_id: row.customer_id,
			management_customer_code: row.management_customer_code,
			customer_name: row.customer_name,
			eligible_quantity: 0,
			invoice_count: 0,
			tax_codes: [],
		};
		current.eligible_quantity += Number(row.eligible_quantity);
		current.invoice_count += Number(row.invoice_count);
		current.tax_codes.push(row.tax_customer_code);
		result[row.customer_id] = current;
		return result;
	}, {}));
	const exportExcel = () => {
		if (rows.length === 0) {
			message.info('Không có số liệu để xuất');
			return;
		}
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(rows.map((row) => ({
			'Mã khách quản trị': row.management_customer_code,
			'Tên khách': row.customer_name,
			'Mã khách thuế': row.tax_customer_code,
			'Số lượng đủ điều kiện': row.eligible_quantity,
			'Số hóa đơn': row.invoice_count,
			'Số đơn': row.order_count,
			'Cách tính ngày': basis,
			'Từ ngày': from,
			'Đến ngày': to,
		})));
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Theo mã thuế');
		XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(byCustomer.map((row) => ({
			'Mã khách quản trị': row.management_customer_code,
			'Tên khách': row.customer_name,
			'Số lượng đủ điều kiện': row.eligible_quantity,
			'Số hóa đơn': row.invoice_count,
			'Các mã thuế': row.tax_codes.join(', '),
		}))), 'Theo khách quản trị');
		XLSX.writeFile(workbook, `So_luong_chiet_khau_${basis}_${from}_${to}.xlsx`);
	};
	return <div className="space-y-4 pb-10">
		<div>
			<Title level={3}>Số lượng tính chiết khấu</Title>
			<p className="text-sm text-gray-600">Chỉ tính các phần đã xác nhận xuất hóa đơn, loại mã NTD. Có thể đổi ngày hóa đơn, ngày giao hoặc ngày hoàn thành kho để đối chiếu.</p>
			<p className="text-sm text-amber-700">Báo cáo thử nghiệm: chưa trừ hàng trả lại/hóa đơn điều chỉnh và chưa khóa kỳ chiết khấu; không dùng làm số chốt thanh toán.</p>
		</div>
		<div className="flex flex-wrap items-end gap-3">
			<div><label className="block text-sm mb-1">Cách chọn ngày</label><Select value={basis} onChange={setBasis} className="w-48" options={[
				{ value: 'invoice', label: 'Ngày hóa đơn' },
				{ value: 'delivery', label: 'Ngày giao hàng' },
				{ value: 'warehouse', label: 'Ngày hoàn thành kho' },
			]} /></div>
			<div><label className="block text-sm mb-1">Từ ngày</label><Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></div>
			<div><label className="block text-sm mb-1">Đến ngày</label><Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></div>
			<div><label className="block text-sm mb-1">Mã khách quản trị</label><Input placeholder="Tất cả" value={customerCode} onChange={(event) => setCustomerCode(event.target.value)} /></div>
			<Button onClick={exportExcel} disabled={!rows.length}>Xuất Excel</Button>
		</div>
		<Title level={5}>Tổng hợp theo khách quản trị</Title>
		<Table rowKey="customer_id" loading={isLoading} dataSource={byCustomer} columns={[
			{ title: 'Mã quản trị', dataIndex: 'management_customer_code' },
			{ title: 'Khách hàng', dataIndex: 'customer_name' },
			{ title: 'Số lượng đủ điều kiện', dataIndex: 'eligible_quantity' },
			{ title: 'Số hóa đơn', dataIndex: 'invoice_count' },
			{ title: 'Các mã thuế', dataIndex: 'tax_codes', render: (value: string[]) => value.join(', ') },
		]} pagination={{ pageSize: 50 }} scroll={{ x: 720 }} />
		<Title level={5}>Chi tiết theo mã khách thuế</Title>
		<Table rowKey={(row) => `${row.customer_id}:${row.tax_customer_code}`} loading={isLoading} dataSource={rows} columns={[
			{ title: 'Mã quản trị', dataIndex: 'management_customer_code' },
			{ title: 'Khách hàng', dataIndex: 'customer_name' },
			{ title: 'Mã thuế', dataIndex: 'tax_customer_code' },
			{ title: 'Số lượng đủ điều kiện', dataIndex: 'eligible_quantity' },
			{ title: 'Số hóa đơn', dataIndex: 'invoice_count' },
			{ title: 'Số đơn', dataIndex: 'order_count' },
		]} pagination={{ pageSize: 50 }} scroll={{ x: 720 }} />
	</div>;
}
