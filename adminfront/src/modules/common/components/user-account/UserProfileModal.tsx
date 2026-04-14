'use client';

import { Input } from '@/components/Input';
import { useAdminUpdateMyProfile } from '@/lib/hooks/api/account/mutations';
import { getErrorMessage } from '@/lib/utils';
import { Form, Modal, message } from 'antd';
import { useEffect } from 'react';

export type UserProfileModalProps = {
	open: boolean;
	onClose: () => void;
	user: {
		first_name?: string | null;
		last_name?: string | null;
		phone?: string | null;
	};
};

export function UserProfileModal({ open, onClose, user }: UserProfileModalProps) {
	const [form] = Form.useForm();
	const { mutateAsync, isLoading } = useAdminUpdateMyProfile();

	useEffect(() => {
		if (open) {
			form.setFieldsValue({
				first_name: user.first_name ?? '',
				last_name: user.last_name ?? '',
				phone: user.phone ?? '',
			});
		}
	}, [open, user, form]);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			await mutateAsync({
				first_name: values.first_name,
				last_name: values.last_name,
				phone: values.phone,
			});
			message.success('Cập nhật thông tin thành công');
			onClose();
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'errorFields' in err) {
				return;
			}
			message.error(getErrorMessage(err));
		}
	};

	return (
		<Modal
			title="Thông tin tài khoản"
			open={open}
			onCancel={onClose}
			onOk={handleOk}
			okText="Lưu"
			cancelText="Huỷ"
			confirmLoading={isLoading}
			destroyOnClose
		>
			<Form form={form} layout="vertical" className="pt-2">
				<Form.Item
					name="first_name"
					label="Tên"
					rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
				>
					<Input placeholder="Tên" />
				</Form.Item>
				<Form.Item name="last_name" label="Họ">
					<Input placeholder="Họ" />
				</Form.Item>
				<Form.Item name="phone" label="Số điện thoại">
					<Input placeholder="Số điện thoại" />
				</Form.Item>
			</Form>
		</Modal>
	);
}
