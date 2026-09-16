'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import { useQuery } from '@tanstack/react-query';
import { Input, Select, Table, message } from 'antd';
import dayjs from 'dayjs';
import { useMedusa } from 'medusa-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';

type Basis = 'invoice' | 'delivery' | 'warehouse';
const basisDescription: Record<Basis, string> = {
	invoice: 'Lọc theo ngày hóa đơn đã phát hành của từng phần hóa đơn.',
	delivery: 'Lọc theo ngày giao hàng của đơn; phần hóa đơn vẫn phải được xác nhận đã xuất.',
	warehouse: 'Lọc theo ngày hoàn thành kho của đơn; phần hóa đơn vẫn phải được xác nhận đã xuất.',
};
type DiscountRow = {
	customer_id: string;
	management_customer_code: string;
	customer_name: string;
	product_key: string;
	product_code: string;
	product_name: string;
	management_quantity: number;
	management_unit_price: number;
	management_amount: number;
	invoiced_quantity: number;
	invoiced_unit_price: number;
	invoiced_amount: number;
	invoice_count: number;
	order_count: number;
	tax_customer_codes: string;
	customer_invoice_count: number;
	customer_order_count: number;
};

const number = new Intl.NumberFormat('vi-VN');
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

export default function AccountingDiscountPage() {
	const { client } = useMedusa();
	const [basis, setBasis] = useState<Basis>('invoice');
	const [from, setFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
	const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'));
	const [customerCode, setCustomerCode] = useState('');
	const { data, isLoading, error } = useQuery({
		queryKey: ['accounting-discount', basis, from, to, customerCode],
		queryFn: async () => {
			const params = new URLSearchParams({ basis, from, to });
			if (customerCode.trim()) params.set('customer_code', customerCode.trim());
			return client.admin.custom.get(`/admin/accounting/discount-eligible?${params}`) as Promise<{ rows: DiscountRow[] }>;
		},
		enabled: Boolean(from && to && from <= to),
	});
	const rows = data?.rows ?? [];
	const totalEligibleQuantity = rows.reduce((sum, row) => sum + Number(row.invoiced_quantity), 0);
	const totalInvoicedAmount = rows.reduce((sum, row) => sum + Number(row.invoiced_amount), 0);
	const byCustomer = Object.values(rows.reduce<Record<string, {
		customer_id: string; management_customer_code: string; customer_name: string;
		management_quantity: number; management_amount: number; invoiced_quantity: number; invoiced_amount: number;
		invoice_count: number; order_count: number; tax_codes: string[];
	}>>((result, row) => {
		const current = result[row.customer_id] ?? {
			customer_id: row.customer_id,
			management_customer_code: row.management_customer_code,
			customer_name: row.customer_name,
			management_quantity: 0,
			management_amount: 0,
			invoiced_quantity: 0,
			invoiced_amount: 0,
			invoice_count: Number(row.customer_invoice_count),
			order_count: Number(row.customer_order_count),
			tax_codes: [],
		};
		current.management_quantity += Number(row.management_quantity);
		current.management_amount += Number(row.management_amount);
		current.invoiced_quantity += Number(row.invoiced_quantity);
		current.invoiced_amount += Number(row.invoiced_amount);
		row.tax_customer_codes.split(',').map((code) => code.trim()).filter(Boolean).forEach((code) => {
			if (!current.tax_codes.includes(code)) current.tax_codes.push(code);
		});
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
			'Mã hàng': row.product_code,
			'Tên hàng': row.product_name,
			'SL sổ quản trị': row.management_quantity,
			'Đơn giá sổ quản trị': row.management_unit_price,
			'Thành tiền sổ quản trị': row.management_amount,
			'SL đã xuất hóa đơn': row.invoiced_quantity,
			'Đơn giá đã xuất hóa đơn': row.invoiced_unit_price,
			'Thành tiền đã xuất hóa đơn': row.invoiced_amount,
			'Các mã khách thuế': row.tax_customer_codes,
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
			'SL sổ quản trị': row.management_quantity,
			'Thành tiền sổ quản trị': row.management_amount,
			'SL đã xuất hóa đơn': row.invoiced_quantity,
			'Thành tiền đã xuất hóa đơn': row.invoiced_amount,
			'Số hóa đơn': row.invoice_count,
			'Số đơn': row.order_count,
			'Các mã thuế': row.tax_codes.join(', '),
		}))), 'Theo khách quản trị');
		XLSX.writeFile(workbook, `So_luong_chiet_khau_${basis}_${from}_${to}.xlsx`);
	};
	return <div className="mx-auto max-w-7xl space-y-4 pb-10">
		<div>
			<Title level={3} className="!mb-1">Số lượng tính chiết khấu</Title>
			<p className="text-sm text-gray-500 mb-0">Bảng kê số lượng, đơn giá và thành tiền giữa sổ quản trị với phần đã xuất hóa đơn.</p>
		</div>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
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
		<div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-gray-700 space-y-1">
			<div className="font-medium text-gray-900">Cách đọc số lượng</div>
			<div>Cột sổ quản trị lấy toàn bộ hàng của những đơn có ít nhất một phần hóa đơn thuộc kỳ lọc. Cột đã xuất hóa đơn chỉ lấy số lượng đã xác nhận phát hành, không tính mã NTD.</div>
			<div>Ví dụ: đơn 28 sản phẩm chia 14 cho mã A và 14 cho mã B. Nếu cả hai phần đã xuất và thuộc kỳ lọc, mỗi mã được tính 14, khách quản trị được tính 28. Nếu mới xuất một phần, chỉ 14 được tính.</div>
			<div>{basisDescription[basis]} Đơn giá và thành tiền hiện lấy theo giá dòng của đơn; chưa áp dụng bảng bậc chiết khấu.</div>
		</div>
		<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
			<div className="rounded-lg bg-gray-50 px-4 py-3 text-sm"><span className="text-gray-500">Tổng số lượng đã xuất hóa đơn</span><div className="text-xl font-semibold mt-1">{error ? 'Không có dữ liệu' : isLoading ? 'Đang tải...' : number.format(totalEligibleQuantity)}</div></div>
			<div className="rounded-lg bg-gray-50 px-4 py-3 text-sm"><span className="text-gray-500">Tổng thành tiền đã xuất hóa đơn</span><div className="text-xl font-semibold mt-1">{error ? 'Không có dữ liệu' : isLoading ? 'Đang tải...' : money.format(totalInvoicedAmount)}</div></div>
		</div>
		{Boolean(error) && <div className="mt-3 text-sm text-red-600">Không tải được số lượng tính chiết khấu. Kiểm tra khoảng ngày rồi thử lại.</div>}
		{!isLoading && !error && rows.length === 0 && <div className="mt-3 text-sm text-gray-600">Chưa có phần hóa đơn đủ điều kiện trong khoảng ngày này. Kiểm tra trạng thái đã xuất, mã NTD và mã khách quản trị đang lọc.</div>}
		<div className="mt-3 text-xs text-amber-700">Báo cáo thử nghiệm: chưa trừ hàng trả lại/hóa đơn điều chỉnh và chưa khóa kỳ. Không dùng làm số chốt thanh toán.</div>
		</Card>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
		<Title level={4}>Tổng hợp theo khách quản trị</Title>
		<Table rowKey="customer_id" loading={isLoading} dataSource={byCustomer} columns={[
			{ title: 'Mã quản trị', dataIndex: 'management_customer_code' },
			{ title: 'Khách hàng', dataIndex: 'customer_name' },
			{ title: 'SL quản trị', dataIndex: 'management_quantity', render: (value: number) => number.format(value) },
			{ title: 'Tiền quản trị', dataIndex: 'management_amount', render: (value: number) => money.format(value) },
			{ title: 'SL đã xuất HĐ', dataIndex: 'invoiced_quantity', render: (value: number) => number.format(value) },
			{ title: 'Tiền đã xuất HĐ', dataIndex: 'invoiced_amount', render: (value: number) => money.format(value) },
			{ title: 'Số hóa đơn', dataIndex: 'invoice_count' },
			{ title: 'Số đơn', dataIndex: 'order_count' },
			{ title: 'Các mã thuế', dataIndex: 'tax_codes', render: (value: string[]) => value.join(', ') },
		]} pagination={{ pageSize: 50 }} scroll={{ x: 720 }} />
		</Card>
		<Card className="!rounded-xl !shadow-none !border !border-gray-200" bordered>
		<Title level={4}>Bảng kê theo mặt hàng</Title>
		<Table rowKey={(row) => `${row.customer_id}:${row.product_key}`} loading={isLoading} dataSource={rows} columns={[
			{ title: 'Mã quản trị', dataIndex: 'management_customer_code' },
			{ title: 'Khách hàng', dataIndex: 'customer_name' },
			{ title: 'Mã hàng', dataIndex: 'product_code' },
			{ title: 'Tên hàng', dataIndex: 'product_name' },
			{ title: 'SL quản trị', dataIndex: 'management_quantity', render: (value: number) => number.format(value) },
			{ title: 'Đơn giá QT', dataIndex: 'management_unit_price', render: (value: number) => money.format(value) },
			{ title: 'Thành tiền QT', dataIndex: 'management_amount', render: (value: number) => money.format(value) },
			{ title: 'SL đã xuất HĐ', dataIndex: 'invoiced_quantity', render: (value: number) => number.format(value) },
			{ title: 'Đơn giá HĐ', dataIndex: 'invoiced_unit_price', render: (value: number) => money.format(value) },
			{ title: 'Thành tiền HĐ', dataIndex: 'invoiced_amount', render: (value: number) => money.format(value) },
			{ title: 'Mã khách thuế', dataIndex: 'tax_customer_codes' },
			{ title: 'Số hóa đơn', dataIndex: 'invoice_count' },
			{ title: 'Số đơn', dataIndex: 'order_count' },
		]} pagination={{ pageSize: 50 }} scroll={{ x: 1500 }} />
		</Card>
	</div>;
}
