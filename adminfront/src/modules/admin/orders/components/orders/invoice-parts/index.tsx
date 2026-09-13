'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import { getErrorMessage } from '@/lib/utils';
import { Order } from '@/types/order';
import { useQuery } from '@tanstack/react-query';
import { Input, InputNumber, Select, Tag, message } from 'antd';
import { useMedusa } from 'medusa-react';
import { useEffect, useMemo, useState } from 'react';

type InvoiceProfile = { id: string; misa_customer_code: string; label: string; is_active: boolean };
type InvoicePart = {
	id: string;
	profile_id: string;
	misa_customer_code: string;
	profile_label: string;
	consumer_name: string | null;
	consumer_address: string | null;
	invoice_date: string | null;
	is_issued: boolean;
	items: Array<{ line_item_id: string; quantity: number }>;
};
type DraftPart = {
	key: string;
	id?: string;
	profile_id: string;
	consumer_name: string;
	consumer_address: string;
	quantities: Record<string, number>;
	is_issued: boolean;
	invoice_date: string | null;
};
type MoneyTotals = { subtotal: number; discount_total: number; tax_total: number; shipping_total: number; total: number };
type Reconciliation = {
	management: MoneyTotals;
	tax_parts: Array<MoneyTotals & { part_id: string; misa_customer_code: string }>;
	difference: MoneyTotals;
};
const vnd = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)} đ`;

export default function InvoiceParts({ order }: { order: Order }) {
	const { client } = useMedusa();
	const [drafts, setDrafts] = useState<DraftPart[]>([]);
	const [saving, setSaving] = useState(false);
	const [issueDates, setIssueDates] = useState<Record<string, string>>({});
	const [issuingId, setIssuingId] = useState<string | null>(null);
	const customerId = order.customer_id;
	const lineItems = useMemo(() => order.items ?? [], [order.items]);
	const { data: profiles = [] } = useQuery({
		queryKey: ['customer-invoice-profiles', customerId],
		queryFn: async () => {
			const response = await client.admin.custom.get(`/admin/customers/${customerId}/invoice-profiles`) as { profiles: InvoiceProfile[] };
			return response.profiles;
		},
		enabled: Boolean(customerId),
	});
	const { data: parts = [], refetch } = useQuery({
		queryKey: ['order-invoice-parts', order.id],
		queryFn: async () => {
			const response = await client.admin.custom.get(`/admin/orders/${order.id}/invoice-parts`) as { parts: InvoicePart[] };
			return response.parts;
		},
	});
	const { data: reconciliation, error: reconciliationError, refetch: refetchReconciliation } = useQuery({
		queryKey: ['order-invoice-reconciliation', order.id, order.updated_at],
		queryFn: async () => {
			const response = await client.admin.custom.get(`/admin/orders/${order.id}/invoice-parts/reconciliation`) as { reconciliation: Reconciliation };
			return response.reconciliation;
		},
		enabled: parts.length > 0,
		retry: false,
	});
	useEffect(() => {
		setDrafts(parts.map((part) => ({
			key: part.id,
			id: part.id,
			profile_id: part.profile_id,
			consumer_name: part.consumer_name ?? '',
			consumer_address: part.consumer_address ?? '',
			quantities: Object.fromEntries(part.items.map((item) => [item.line_item_id, item.quantity])),
			is_issued: part.is_issued,
			invoice_date: part.invoice_date,
		})));
	}, [parts]);

	const hasIssued = drafts.some((draft) => draft.is_issued);
	const totals = useMemo(() => {
		const values: Record<string, number> = {};
		for (const item of lineItems) values[item.id] = 0;
		for (const draft of drafts) {
			for (const [itemId, quantity] of Object.entries(draft.quantities)) {
				values[itemId] = (values[itemId] ?? 0) + (Number(quantity) || 0);
			}
		}
		return values;
	}, [drafts, lineItems]);
	const updateDraft = (key: string, patch: Partial<DraftPart>) => {
		setDrafts((previous) => previous.map((draft) => draft.key === key ? { ...draft, ...patch } : draft));
	};
	const addPart = () => {
		setDrafts((previous) => [...previous, {
			key: `new-${Date.now()}-${Math.random()}`,
			profile_id: profiles.find((profile) => profile.is_active)?.id ?? '',
			consumer_name: '',
			consumer_address: '',
			quantities: {},
			is_issued: false,
			invoice_date: null,
		}]);
	};
	const save = async () => {
		for (const item of lineItems) {
			if (totals[item.id] !== item.quantity) {
				message.error(`Mặt hàng ${item.variant?.sku || item.title} phải phân đủ ${item.quantity}, hiện có ${totals[item.id] ?? 0}`);
				return;
			}
		}
		for (const draft of drafts) {
			const profile = profiles.find((candidate) => candidate.id === draft.profile_id);
			if (!profile || !profile.is_active || !Object.values(draft.quantities).some((quantity) => quantity > 0)) {
				message.error('Mỗi phần hóa đơn cần mã khách thuế đang sử dụng và số lượng hàng');
				return;
			}
			if (profile.misa_customer_code === 'NTD' && (!draft.consumer_name.trim() || !draft.consumer_address.trim())) {
				message.error('Phần NTD cần tên và địa chỉ người tiêu dùng');
				return;
			}
		}
		setSaving(true);
		try {
			await client.admin.custom.post(`/admin/orders/${order.id}/invoice-parts`, {
				parts: drafts.map((draft) => ({
					profile_id: draft.profile_id,
					consumer_name: draft.consumer_name,
					consumer_address: draft.consumer_address,
					items: Object.entries(draft.quantities)
						.filter(([, quantity]) => quantity > 0)
						.map(([line_item_id, quantity]) => ({ line_item_id, quantity })),
				})),
			});
			message.success('Đã lưu phân bổ hóa đơn');
			await refetch();
			await refetchReconciliation();
		} catch (error) {
			message.error(getErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};
	const markIssued = async (partId: string) => {
		const invoiceDate = issueDates[partId];
		if (!invoiceDate) {
			message.error('Chọn ngày hóa đơn thực tế');
			return;
		}
		setIssuingId(partId);
		try {
			await client.admin.custom.post(`/admin/orders/${order.id}/invoice-parts/${partId}/issue`, { invoice_date: invoiceDate });
			message.success('Đã ghi nhận ngày hóa đơn');
			await refetch();
		} catch (error) {
			message.error(getErrorMessage(error));
		} finally {
			setIssuingId(null);
		}
	};

	return <Card className="w-full" bordered={false}>
		<div className="flex items-center justify-between gap-2 mb-3">
			<Title level={4} className="!mb-0">Phân bổ xuất hóa đơn</Title>
			<Button size="small" onClick={addPart} disabled={hasIssued || profiles.every((profile) => !profile.is_active)}>Thêm phần hóa đơn</Button>
		</div>
		<div className="text-xs text-gray-500 mb-3">Một đơn có thể chia cho nhiều mã thuế, kể cả nhiều hóa đơn cùng một mã. Tổng số lượng từng mặt hàng phải bằng đơn quản trị. Ngày hóa đơn thực tế được ghi riêng sau khi hóa đơn đã phát hành.</div>
		<div className="text-xs text-amber-700 mb-3">Đã có đối chiếu tiền dự kiến nhưng phân bổ này chưa được nối vào file MISA hiện tại. Không dùng file xuất hiện tại làm file thuế cho đơn đã tách.</div>
		{reconciliation && <div className="border rounded p-3 mb-3 text-sm space-y-1">
			<div className="font-medium">Đối chiếu tiền dự kiến (VND)</div>
			<div>Quản trị: {vnd(reconciliation.management.total)} · Thuế: {vnd(reconciliation.tax_parts.reduce((sum, part) => sum + part.total, 0))}</div>
			<div>Chênh lệch: {vnd(reconciliation.difference.total)} · Trước thuế {vnd(reconciliation.difference.subtotal)} · Chiết khấu {vnd(reconciliation.difference.discount_total)} · VAT {vnd(reconciliation.difference.tax_total)} · Phí giao {vnd(reconciliation.difference.shipping_total)}</div>
			{reconciliation.tax_parts.map((part) => <div key={part.part_id} className="text-xs border-t pt-1">
				{part.misa_customer_code}: trước thuế {vnd(part.subtotal)} − CK {vnd(part.discount_total)} + phí giao {vnd(part.shipping_total)} + VAT {vnd(part.tax_total)} = {vnd(part.total)}
			</div>)}
			<div className="text-xs text-amber-700">Chỉ là phép chia và đối chiếu nội bộ; chưa xác nhận cấu trúc import MISA.</div>
		</div>}
		{Boolean(reconciliationError) && parts.length > 0 && <div className="text-xs text-red-600 mb-3">Chưa đối chiếu được tiền: {String(getErrorMessage(reconciliationError))}</div>}
		{profiles.length === 0 && <div className="text-sm text-amber-700 mb-3">Khách chưa có mã thuế. Hãy thêm trong hồ sơ Khách hàng trước.</div>}
		{drafts.map((draft, index) => {
			const profile = profiles.find((candidate) => candidate.id === draft.profile_id);
			return <div key={draft.key} className="border rounded p-3 mb-3 space-y-3">
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-medium">Hóa đơn {index + 1}</span>
					{draft.is_issued ? <Tag color="green">Đã xuất {draft.invoice_date}</Tag> : <Tag>Chưa xác nhận xuất</Tag>}
					{!hasIssued && <Button type="link" danger size="small" onClick={() => setDrafts((previous) => previous.filter((part) => part.key !== draft.key))}>Bỏ phần</Button>}
				</div>
				<Select className="w-full" value={draft.profile_id || undefined} placeholder="Chọn mã khách thuế" disabled={hasIssued} onChange={(profile_id) => updateDraft(draft.key, { profile_id })}
					options={profiles.filter((item) => item.is_active || item.id === draft.profile_id).map((item) => ({ value: item.id, label: `${item.misa_customer_code} — ${item.label}` }))} />
				{profile?.misa_customer_code === 'NTD' && <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
					<Input placeholder="Tên người tiêu dùng" value={draft.consumer_name} disabled={hasIssued} onChange={(event) => updateDraft(draft.key, { consumer_name: event.target.value })} />
					<Input placeholder="Địa chỉ người tiêu dùng" value={draft.consumer_address} disabled={hasIssued} onChange={(event) => updateDraft(draft.key, { consumer_address: event.target.value })} />
				</div>}
				{lineItems.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
					<span>{item.variant?.sku || item.title} · đơn {item.quantity}</span>
					<InputNumber min={0} max={item.quantity} precision={0} value={draft.quantities[item.id] ?? 0} disabled={hasIssued}
						onChange={(quantity) => updateDraft(draft.key, { quantities: { ...draft.quantities, [item.id]: quantity ?? 0 } })} />
				</div>)}
				{draft.id && !draft.is_issued && <div className="flex flex-wrap gap-2 items-center">
					<Input type="date" className="w-auto" value={issueDates[draft.id] ?? ''} onChange={(event) => setIssueDates((previous) => ({ ...previous, [draft.id!]: event.target.value }))} />
					<Button size="small" loading={issuingId === draft.id} onClick={() => markIssued(draft.id!)}>Xác nhận đã xuất hóa đơn</Button>
				</div>}
			</div>;
		})}
		{drafts.length > 0 && <div className="space-y-2">
			{lineItems.map((item) => <div key={item.id} className={`text-xs ${(totals[item.id] ?? 0) === item.quantity ? 'text-green-700' : 'text-red-600'}`}>
				{item.variant?.sku || item.title}: phân {totals[item.id] ?? 0}/{item.quantity}
			</div>)}
		</div>}
		<div className="mt-3"><Button type="primary" onClick={save} loading={saving} disabled={hasIssued || drafts.length === 0}>Lưu phân bổ</Button></div>
	</Card>;
}
