'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Title } from '@/components/Typography';
import { getErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Form, List, Modal, Switch, Tag, message } from 'antd';
import { useMedusa } from 'medusa-react';
import { useState } from 'react';

type InvoiceProfile = {
	id: string;
	misa_customer_code: string;
	label: string;
	is_active: boolean;
};

type ProfileForm = {
	misa_customer_code: string;
	label: string;
	is_active: boolean;
};

export default function CustomerInvoiceProfiles({ customerId, enabled }: { customerId: string; enabled: boolean }) {
	const { client } = useMedusa();
	const [form] = Form.useForm<ProfileForm>();
	const [editing, setEditing] = useState<InvoiceProfile | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const { data: profiles = [], refetch } = useQuery({
		queryKey: ['customer-invoice-profiles', customerId],
		queryFn: async () => {
			const response = await client.admin.custom.get(`/admin/customers/${customerId}/invoice-profiles`) as { profiles: InvoiceProfile[] };
			return response.profiles;
		},
		enabled: enabled && Boolean(customerId),
	});

	const openDialog = (profile: InvoiceProfile | null) => {
		setEditing(profile);
		form.setFieldsValue({
			misa_customer_code: profile?.misa_customer_code ?? '',
			label: profile?.label ?? '',
			is_active: profile?.is_active ?? true,
		});
		setDialogOpen(true);
	};

	const save = async () => {
		const values = await form.validateFields();
		setSaving(true);
		try {
			const path = `/admin/customers/${customerId}/invoice-profiles${editing ? `/${editing.id}` : ''}`;
			await client.admin.custom.post(path, {
				misa_customer_code: values.misa_customer_code.trim(),
				label: values.label.trim(),
				is_active: values.is_active,
			});
			message.success(editing ? 'Đã cập nhật mã khách thuế' : 'Đã thêm mã khách thuế');
			setDialogOpen(false);
			await refetch();
		} catch (error) {
			message.error(getErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	return <>
		<div className="flex items-center justify-between mb-2">
			<Title level={5} className="!mb-0">Mã khách thuế MISA</Title>
			<Button type="default" size="small" onClick={() => openDialog(null)}>Thêm mã</Button>
		</div>
		<div className="text-xs text-gray-500 mb-3">
			Kế toán và sales admin tạo mã trên MISA trước, sau đó nhập đúng mã đó tại đây. Mã khách quản trị ở phần thông tin khách hàng vẫn giữ nguyên.
		</div>
		<List
			size="small"
			bordered
			dataSource={profiles}
			locale={{ emptyText: 'Chưa có mã khách thuế' }}
			renderItem={(profile) => <List.Item actions={[
				<Button key="edit" type="link" size="small" onClick={() => openDialog(profile)}>Sửa</Button>,
			]}>
				<div className="flex flex-wrap items-center gap-2 text-sm">
					<span className="font-medium">{profile.misa_customer_code}</span>
					<span>{profile.label}</span>
					{!profile.is_active && <Tag>Ngừng sử dụng</Tag>}
				</div>
			</List.Item>}
		/>
		<Modal
			open={dialogOpen}
			title={editing ? 'Sửa mã khách thuế' : 'Thêm mã khách thuế'}
			onCancel={() => setDialogOpen(false)}
			onOk={save}
			okText="Lưu"
			confirmLoading={saving}
			destroyOnClose
		>
			<Form form={form} layout="vertical" className="pt-4">
				<Form.Item name="misa_customer_code" label="Mã khách trên sổ thuế MISA" rules={[{ required: true, whitespace: true, message: 'Nhập mã đã tạo trên MISA' }]}>
					<Input maxLength={100} placeholder="Ví dụ: KH.HKDBINH hoặc NTD" />
				</Form.Item>
				<Form.Item name="label" label="Tên hiển thị để chọn khi lên đơn" rules={[{ required: true, whitespace: true, message: 'Nhập tên hiển thị' }]}>
					<Input maxLength={255} placeholder="Ví dụ: Hộ kinh doanh Hoàng Đào" />
				</Form.Item>
				{editing && <Form.Item name="is_active" label="Đang sử dụng" valuePropName="checked"><Switch /></Form.Item>}
			</Form>
		</Modal>
	</>;
}
