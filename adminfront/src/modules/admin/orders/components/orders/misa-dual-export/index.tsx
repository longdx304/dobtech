'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import { getErrorMessage } from '@/lib/utils';
import { Order } from '@/types/order';
import { useQuery } from '@tanstack/react-query';
import { Alert, Input, Select, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useMedusa } from 'medusa-react';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
	buildDualBookRows, DualBookResult, DualBookSettings,
	InvoicePartForExport, InvoiceReconciliationForExport, ItemMisaSettings,
} from '../export-excel/dual-books';

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const errorText = (error: unknown) => (error as any)?.response ? getErrorMessage(error) : error instanceof Error ? error.message : getErrorMessage(error);
const defaultItemSettings = (): ItemMisaSettings => ({
	unit: 'Đôi', managementWarehouse: 'KHH-HCM', taxWarehouse: 'KHODEPNKTHAI', taxRate: 8,
});

export default function MisaDualExport({ order }: { order: Order }) {
	const { client } = useMedusa();
	const [settings, setSettings] = useState<DualBookSettings>({
		postingDate: dayjs(order.handled_at || new Date()).format('YYYY-MM-DD'), items: {},
	});
	const [preview, setPreview] = useState<DualBookResult | null>(null);
	const [previewSignature, setPreviewSignature] = useState('');
	const [checking, setChecking] = useState(false);
	useEffect(() => {
		setSettings((previous) => ({
			...previous,
			items: Object.fromEntries((order.items ?? []).map((item) => [item.id, previous.items[item.id] ?? defaultItemSettings()])),
		}));
	}, [order.items]);
	const { data: parts = [], refetch: refetchParts } = useQuery({
		queryKey: ['order-invoice-parts', order.id],
		queryFn: async () => {
			const response = await client.admin.custom.get(`/admin/orders/${order.id}/invoice-parts`) as { parts: InvoicePartForExport[] };
			return response.parts;
		},
	});
	const { data: reconciliation, refetch: refetchReconciliation } = useQuery({
		queryKey: ['order-invoice-reconciliation', order.id, order.updated_at],
		queryFn: async () => {
			const response = await client.admin.custom.get(`/admin/orders/${order.id}/invoice-parts/reconciliation`) as { reconciliation: InvoiceReconciliationForExport };
			return response.reconciliation;
		},
		enabled: parts.length > 0,
		retry: false,
	});
	const updateItem = (itemId: string, patch: Partial<ItemMisaSettings>) => {
		setSettings((previous) => ({ ...previous, items: { ...previous.items, [itemId]: { ...(previous.items[itemId] ?? defaultItemSettings()), ...patch } } }));
		setPreview(null);
	};
	const check = async () => {
		setChecking(true);
		try {
			const latestParts = (await refetchParts()).data ?? [];
			if (!latestParts.length) throw new Error('Lưu phân bổ hóa đơn trước khi tạo file QT/TH');
			const latestReconciliation = (await refetchReconciliation()).data;
			if (!latestReconciliation) throw new Error('Chưa đối chiếu được tiền của đơn; kiểm tra phần phân bổ phía trên');
			const result = buildDualBookRows(order, latestParts, latestReconciliation, settings);
			setPreview(result);
			setPreviewSignature(JSON.stringify({ parts: latestParts, reconciliation: latestReconciliation, settings }));
			message.success('Hai sổ đã khớp tổng thanh toán. Có thể tải file thử.');
		} catch (error) {
			setPreview(null);
			message.error(errorText(error));
		} finally {
			setChecking(false);
		}
	};
	const download = (book: 'QT' | 'TH') => {
		if (!preview) return;
		try {
			if (previewSignature !== JSON.stringify({ parts, reconciliation, settings })) throw new Error('Phân bổ hoặc cấu hình đã thay đổi; hãy kiểm tra lại 2 sổ');
			const makeFile = (rows: DualBookResult['managementRows']) => {
				const workbook = XLSX.utils.book_new();
				const sheet = XLSX.utils.json_to_sheet(rows, { cellDates: true });
				for (let rowIndex = 2; rowIndex <= rows.length + 1; rowIndex += 1) {
					for (const column of ['H', 'I', 'P']) {
						const cell = sheet[`${column}${rowIndex}`];
						if (cell?.t === 'd') cell.z = 'dd/mm/yyyy';
					}
				}
				XLSX.utils.book_append_sheet(workbook, sheet, 'Đơn hàng');
				XLSX.writeFile(workbook, `${book}_Order_${order.display_id}_${settings.postingDate}.xlsx`);
			};
			makeFile(book === 'QT' ? preview.managementRows : preview.taxRows);
			message.success(`Đã tạo file ${book}`);
		} catch (error) {
			message.error(errorText(error));
		}
	};

	return <Card className="w-full !rounded-xl !shadow-none !border !border-gray-200" bordered>
		<div className="flex flex-wrap items-start justify-between gap-3 mb-4">
			<div>
				<Title level={4} className="!mb-1">Xuất MISA hai sổ</Title>
				<p className="text-sm text-gray-500 mb-0">Một đơn quản trị, nhiều chứng từ thuế. Kiểm tra tổng tiền trước khi tải.</p>
			</div>
			<Tag color="blue">Bản thử trên staging</Tag>
		</div>
		<Alert
			className="mb-4"
			type="warning"
			showIcon
			message="Cần kiểm chứng import trên MISA trước khi dùng thật"
			description="Dùng số chứng từ BH…/n và BH…-i/n theo mẫu kế toán cung cấp; tên file phân biệt QT/TH. Giá dòng là số tiền cuối cùng, chiết khấu và phí giao trên đơn được phân bổ vào giá hàng. Kế toán cần kiểm tra VAT, kho và ĐVT theo từng mặt hàng."
		/>
		<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
			<div className="md:col-span-1">
				<label className="block text-xs font-medium text-gray-600 mb-1">Ngày chứng từ và hạch toán</label>
				<Input type="date" value={settings.postingDate} onChange={(event) => { setSettings((previous) => ({ ...previous, postingDate: event.target.value })); setPreview(null); }} />
			</div>
			<div className="md:col-span-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
				<div className="flex justify-between"><span className="text-gray-500">Tổng đơn</span><strong>{money.format(order.total ?? 0)}</strong></div>
				<div className="flex justify-between mt-1"><span className="text-gray-500">Phần hóa đơn</span><strong>{parts.length}</strong></div>
			</div>
		</div>
		<div className="text-sm font-medium mb-2">Thiết lập theo mặt hàng</div>
		<div className="space-y-2 mb-4">
			{(order.items ?? []).map((item) => {
				const config = settings.items[item.id] ?? defaultItemSettings();
				return <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end rounded-lg border border-gray-200 p-3">
					<div className="md:col-span-4 min-w-0">
						<div className="font-medium text-sm truncate" title={item.variant?.sku || item.title}>{item.variant?.sku || item.title}</div>
						<div className="text-xs text-gray-500">Số lượng: {item.quantity}</div>
					</div>
					<div className="md:col-span-2"><label className="block text-xs text-gray-500 mb-1">ĐVT</label><Input value={config.unit} onChange={(event) => updateItem(item.id, { unit: event.target.value })} /></div>
					<div className="md:col-span-2"><label className="block text-xs text-gray-500 mb-1">Kho QT</label><Input value={config.managementWarehouse} onChange={(event) => updateItem(item.id, { managementWarehouse: event.target.value })} /></div>
					<div className="md:col-span-2"><label className="block text-xs text-gray-500 mb-1">Kho TH</label><Input value={config.taxWarehouse} onChange={(event) => updateItem(item.id, { taxWarehouse: event.target.value })} /></div>
					<div className="md:col-span-2"><label className="block text-xs text-gray-500 mb-1">VAT TH</label><Select className="w-full" value={config.taxRate} onChange={(taxRate) => updateItem(item.id, { taxRate })} options={[0, 5, 8, 10].map((rate) => ({ value: rate, label: `${rate}%` }))} /></div>
				</div>;
			})}
		</div>
		<div className="flex flex-wrap items-center gap-2">
			<Button type="primary" loading={checking} onClick={check}>Kiểm tra 2 sổ</Button>
			<Button type="default" disabled={!preview} onClick={() => download('QT')}>Tải file thử QT</Button>
			<Button type="default" disabled={!preview} onClick={() => download('TH')}>Tải file thử TH</Button>
			{!parts.length && <span className="text-xs text-amber-700">Cần lưu phân bổ hóa đơn trước.</span>}
		</div>
		{preview && <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
			<div className="font-medium text-green-800">Tổng thanh toán khớp: QT {money.format(preview.managementTotal)} = TH {money.format(preview.taxTotal)}</div>
			<div className="mt-1 text-gray-600">{preview.managementRows.length} dòng QT · {preview.taxRows.length} dòng TH · {preview.documentNumbers.length} chứng từ thuế</div>
			<div className="mt-1 text-xs text-gray-600">Số chứng từ QT: {String(preview.managementRows[0]['Số chứng từ (*)'])}</div>
			<div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">{preview.taxDocuments.map((document) => <div key={document.number} className="rounded border border-green-200 bg-white px-3 py-2 text-xs">
				<div className="font-medium">{document.number} · {document.customerCode}</div>
				<div className="text-gray-600 mt-1">Tổng SL: {document.quantity} · {money.format(document.total)}</div>
			</div>)}</div>
			<ul className="mt-2 mb-0 pl-5 list-disc text-xs text-gray-600">{preview.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul>
		</div>}
	</Card>;
}
