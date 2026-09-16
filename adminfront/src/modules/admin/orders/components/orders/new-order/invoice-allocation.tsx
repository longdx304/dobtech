'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Title } from '@/components/Typography';
import { useStepModal } from '@/lib/providers/stepped-modal-provider';
import { getErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Alert, Form, InputNumber, Modal, Select, Tag, message } from 'antd';
import { useMedusa } from 'medusa-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NewOrderInvoicePart, normalizeInvoiceParts } from './invoice-allocation-utils';

export type { NewOrderInvoicePart } from './invoice-allocation-utils';

type InvoiceProfile = {
	id: string;
	misa_customer_code: string;
	label: string;
	is_active: boolean;
};

type OrderItem = {
	variant_id: string;
	quantity: number;
	sku?: string | null;
	title: string;
	product_title?: string;
};

type Props = {
	customerId?: string;
	items: OrderItem[];
	value: NewOrderInvoicePart[];
	onChange: (parts: NewOrderInvoicePart[]) => void;
};

const makeKey = () => `invoice-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function InvoiceAllocation({ customerId, items, value, onChange }: Props) {
	const { client } = useMedusa();
	const { enableNext, disableNext } = useStepModal();
	const [profileModalOpen, setProfileModalOpen] = useState(false);
	const lastValidity = useRef<boolean | null>(null);
	const [profileForm] = Form.useForm<{ misa_customer_code: string; label: string }>();
	const [savingProfile, setSavingProfile] = useState(false);
	const { data: profiles = [], isLoading, refetch } = useQuery({
		queryKey: ['customer-invoice-profiles', customerId],
		queryFn: async () => {
			const response = await client.admin.custom.get(`/admin/customers/${customerId}/invoice-profiles`) as { profiles: InvoiceProfile[] };
			return response.profiles.filter((profile) => profile.is_active);
		},
		enabled: Boolean(customerId),
	});

	const normalized = useMemo(() => normalizeInvoiceParts(value, items), [items, value]);
	const valid = Boolean(customerId) && normalized.length > 0 && normalized.every((part) => {
		const profile = profiles.find((candidate) => candidate.id === part.profile_id);
		const total = Object.values(part.quantities).reduce((sum, quantity) => sum + quantity, 0);
		return Boolean(profile) && total > 0 && (profile?.misa_customer_code !== 'NTD' || (part.consumer_name?.trim() && part.consumer_address?.trim()));
	}) && items.every((item) => normalized.reduce((sum, part) => sum + (part.quantities[item.variant_id] ?? 0), 0) === item.quantity);

	useEffect(() => {
		if (lastValidity.current === valid) return;
		lastValidity.current = valid;
		if (valid) enableNext();
		else disableNext();
	}, [disableNext, enableNext, valid]);

	useEffect(() => {
		if (!profiles.length || (value.length && value.every((part) => profiles.some((profile) => profile.id === part.profile_id)))) return;
		onChange([{
			key: makeKey(),
			profile_id: profiles[0].id,
			quantities: Object.fromEntries(items.map((item) => [item.variant_id, item.quantity])),
		}]);
	}, [items, onChange, profiles, value]);

	useEffect(() => {
		if (JSON.stringify(normalized) !== JSON.stringify(value)) onChange(normalized);
	}, [normalized, onChange, value]);

	const updatePart = (key: string, patch: Partial<NewOrderInvoicePart>) => {
		onChange(normalizeInvoiceParts(value.map((part) => part.key === key ? { ...part, ...patch } : part), items));
	};

	const addPart = () => {
		onChange(normalizeInvoiceParts([...value, {
			key: makeKey(),
			profile_id: profiles[0]?.id ?? '',
			quantities: {},
		}], items));
	};

	const removePart = (key: string) => {
		onChange(normalizeInvoiceParts(value.filter((part) => part.key !== key), items));
	};

	const saveProfile = async () => {
		if (!customerId) return;
		const values = await profileForm.validateFields();
		setSavingProfile(true);
		try {
			const response = await client.admin.custom.post(`/admin/customers/${customerId}/invoice-profiles`, {
				misa_customer_code: values.misa_customer_code.trim(),
				label: values.label.trim(),
				is_active: true,
			}) as { profile?: InvoiceProfile };
			const refreshed = await refetch();
			const created = response.profile ?? refreshed.data?.find((profile) => profile.misa_customer_code === values.misa_customer_code.trim());
			if (!value.length && created) {
				onChange([{ key: makeKey(), profile_id: created.id, quantities: Object.fromEntries(items.map((item) => [item.variant_id, item.quantity])) }]);
			}
			profileForm.resetFields();
			setProfileModalOpen(false);
			message.success('Đã thêm mã khách thuế');
		} catch (error) {
			message.error(getErrorMessage(error));
		} finally {
			setSavingProfile(false);
		}
	};

	return <div className="space-y-4 min-h-[420px]">
		<div className="flex flex-wrap items-start justify-between gap-3">
			<div>
				<Title level={4} className="!mb-1">Thông tin xuất hóa đơn</Title>
				<p className="text-sm text-gray-500 mb-0">Sales chốt mã khách thuế và số lượng ngay khi tạo đơn. Kế toán chỉ cần kiểm tra và phát hành.</p>
			</div>
			<Button onClick={() => setProfileModalOpen(true)} disabled={!customerId}>Thêm mã thuế mới</Button>
		</div>
		<Alert type="info" showIcon message="Tự động tính phần còn lại" description="Mã cuối cùng tự nhận số lượng còn lại của từng sản phẩm. Với 2 mã, nhập mã 1; mã 2 = tổng − mã 1. Với 3 mã, nhập mã 1 và 2; mã 3 = tổng − mã 1 − mã 2." />
		{!customerId && <Alert type="warning" showIcon message="Quay lại bước Khách hàng và chọn khách trước khi phân bổ hóa đơn." />}
		{customerId && !isLoading && profiles.length === 0 && <Alert type="warning" showIcon message="Khách chưa có mã khách thuế" description="Thêm mã đã tạo trên MISA để tiếp tục tạo đơn." />}
		{normalized.map((part, partIndex) => {
			const profile = profiles.find((candidate) => candidate.id === part.profile_id);
			const isLast = partIndex === normalized.length - 1;
			const total = Object.values(part.quantities).reduce((sum, quantity) => sum + quantity, 0);
			return <div key={part.key} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2"><span className="font-semibold">Khách xuất hóa đơn {partIndex + 1}</span>{isLast && <Tag color="blue">Tự tính còn lại</Tag>}<Tag>{total} đôi</Tag></div>
					{normalized.length > 1 && <Button type="link" danger size="small" onClick={() => removePart(part.key)}>Bỏ</Button>}
				</div>
				<Select className="w-full" loading={isLoading} value={part.profile_id || undefined} placeholder="Chọn mã khách thuế" onChange={(profile_id) => updatePart(part.key, { profile_id })} options={profiles.map((item) => ({ value: item.id, label: `${item.misa_customer_code} — ${item.label}` }))} />
				{profile?.misa_customer_code === 'NTD' && <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
					<Input placeholder="Tên người tiêu dùng" value={part.consumer_name} onChange={(event) => updatePart(part.key, { consumer_name: event.target.value })} />
					<Input placeholder="Địa chỉ người tiêu dùng" value={part.consumer_address} onChange={(event) => updatePart(part.key, { consumer_address: event.target.value })} />
				</div>}
				<div className="divide-y divide-gray-100 rounded-lg border border-gray-100 px-3">
					{items.map((item) => <div key={item.variant_id} className="flex items-center justify-between gap-3 py-2 text-sm">
						<div className="min-w-0"><div className="truncate font-medium">{item.sku || item.product_title || item.title}</div><div className="text-xs text-gray-500">Tổng đơn: {item.quantity}</div></div>
						{isLast ? <span className="min-w-16 text-right font-semibold text-blue-700">{part.quantities[item.variant_id] ?? 0}</span> : <InputNumber min={0} max={item.quantity} precision={0} value={part.quantities[item.variant_id] ?? 0} onChange={(quantity) => updatePart(part.key, { quantities: { ...part.quantities, [item.variant_id]: quantity ?? 0 } })} />}
					</div>)}
				</div>
			</div>;
		})}
		<Button type="dashed" block onClick={addPart} disabled={!profiles.length || !normalized.length}>+ Thêm khách xuất hóa đơn</Button>
		<Modal open={profileModalOpen} title="Thêm mã khách thuế" onCancel={() => setProfileModalOpen(false)} onOk={saveProfile} confirmLoading={savingProfile} okText="Lưu mã">
			<Form form={profileForm} layout="vertical" className="pt-4">
				<Form.Item name="misa_customer_code" label="Mã khách trên sổ thuế MISA" rules={[{ required: true, whitespace: true, message: 'Nhập mã khách thuế' }]}><Input placeholder="Ví dụ: KH.HKDBINH hoặc NTD" /></Form.Item>
				<Form.Item name="label" label="Tên hiển thị" rules={[{ required: true, whitespace: true, message: 'Nhập tên hiển thị' }]}><Input placeholder="Ví dụ: Hộ kinh doanh Hoàng Đào" /></Form.Item>
			</Form>
		</Modal>
	</div>;
}
