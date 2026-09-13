'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import { getErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Input, InputNumber, Modal, Select, message } from 'antd';
import { useMedusa } from 'medusa-react';
import { useState } from 'react';

type ExternalCost = {
	id: string;
	provider: string;
	amount: number;
	paid_by: 'company' | 'customer';
	delivery_date: string;
	reference: string | null;
	note: string | null;
};

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export default function ExternalDeliveryCosts({ orderId }: { orderId: string }) {
	const { client } = useMedusa();
	const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [provider, setProvider] = useState('Grab');
	const [otherProvider, setOtherProvider] = useState('');
	const [amount, setAmount] = useState<number | null>(null);
	const [paidBy, setPaidBy] = useState<'company' | 'customer'>('company');
	const [deliveryDate, setDeliveryDate] = useState('');
	const [reference, setReference] = useState('');
	const [note, setNote] = useState('');
	const { data: costs = [], refetch } = useQuery({
		queryKey: ['external-delivery-costs', orderId],
		queryFn: async () => {
			const response = await client.admin.custom.get(`/admin/orders/${orderId}/external-delivery-costs`) as { costs: ExternalCost[] };
			return response.costs;
		},
	});
	const save = async () => {
		const actualProvider = provider === 'Khác' ? otherProvider.trim() : provider.trim();
		if (!actualProvider || amount === null || amount < 0 || !deliveryDate) {
			message.error('Nhập đơn vị giao, số tiền và ngày giao');
			return;
		}
		setSaving(true);
		try {
			await client.admin.custom.post(`/admin/orders/${orderId}/external-delivery-costs`, {
				provider: actualProvider, amount, paid_by: paidBy, delivery_date: deliveryDate,
				reference: reference.trim(), note: note.trim(),
			});
			message.success('Đã ghi nhận chi phí giao ngoài');
			setOpen(false);
			setAmount(null);
			setOtherProvider('');
			setReference('');
			setNote('');
			await refetch();
		} catch (error) {
			message.error(getErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};
	const remove = async (costId: string) => {
		try {
			await client.admin.custom.delete(`/admin/orders/${orderId}/external-delivery-costs/${costId}`);
			message.success('Đã bỏ khoản chi phí');
			await refetch();
		} catch (error) {
			message.error(getErrorMessage(error));
		}
	};
	return <Card className="w-full" bordered={false}>
		<div className="flex items-center justify-between gap-2 mb-2">
			<Title level={4} className="!mb-0">Chi phí giao ngoài</Title>
			<Button size="small" onClick={() => setOpen(true)}>Thêm chi phí</Button>
		</div>
		<div className="text-xs text-gray-500 mb-3">Theo dõi Grab/Ahamove nội bộ; không đưa khoản này vào file nhập MISA.</div>
		{costs.length === 0 ? <div className="text-sm text-gray-500">Chưa có khoản giao ngoài.</div> : costs.map((cost) =>
			<div key={cost.id} className="flex flex-wrap items-center justify-between gap-2 border-t py-2 text-sm">
				<div>{cost.delivery_date} · {cost.provider} · {money.format(cost.amount)} · {cost.paid_by === 'company' ? 'Công ty trả' : 'Khách trả'}{cost.reference ? ` · ${cost.reference}` : ''}</div>
				<Button type="link" danger size="small" onClick={() => Modal.confirm({ title: 'Bỏ khoản chi phí này?', onOk: () => remove(cost.id) })}>Bỏ</Button>
			</div>
		)}
		<Modal title="Thêm chi phí giao ngoài" open={open} onCancel={() => setOpen(false)} onOk={save} okText="Lưu" confirmLoading={saving}>
			<div className="space-y-3 pt-3">
				<div><label>Đơn vị giao</label><Select className="w-full" value={provider} onChange={setProvider} options={[{ value: 'Grab', label: 'Grab' }, { value: 'Ahamove', label: 'Ahamove' }, { value: 'Khác', label: 'Khác' }]} /></div>
				{provider === 'Khác' && <Input placeholder="Tên đơn vị giao" value={otherProvider} onChange={(event) => setOtherProvider(event.target.value)} />}
				<div><label>Chi phí thực tế (đ)</label><InputNumber className="w-full" min={0} precision={0} value={amount} onChange={setAmount} /></div>
				<div><label>Bên chịu phí</label><Select className="w-full" value={paidBy} onChange={setPaidBy} options={[{ value: 'company', label: 'Công ty' }, { value: 'customer', label: 'Khách hàng' }]} /></div>
				<div><label>Ngày giao</label><Input type="date" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} /></div>
				<Input placeholder="Mã chuyến (nếu có)" value={reference} onChange={(event) => setReference(event.target.value)} />
				<Input placeholder="Ghi chú (nếu có)" value={note} onChange={(event) => setNote(event.target.value)} />
			</div>
		</Modal>
	</Card>;
}
