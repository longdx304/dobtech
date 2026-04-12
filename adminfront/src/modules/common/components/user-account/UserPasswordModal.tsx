'use client';

import InputPassword from '@/components/Input/InputPassword';
import { useAdminChangeMyPassword } from '@/lib/hooks/api/account/mutations';
import { getErrorMessage } from '@/lib/utils';
import { Form, Modal, message } from 'antd';
import { Lock } from 'lucide-react';
import { useEffect } from 'react';

export type UserPasswordModalProps = {
	open: boolean;
	onClose: () => void;
};

type FormValues = {
	old_password: string;
	new_password: string;
	confirm_password: string;
};

export function UserPasswordModal({ open, onClose }: UserPasswordModalProps) {
	const [form] = Form.useForm<FormValues>();
	const { mutateAsync, isLoading } = useAdminChangeMyPassword();

	useEffect(() => {
		if (open) {
			form.resetFields();
		}
	}, [open, form]);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			await mutateAsync({
				old_password: values.old_password,
				new_password: values.new_password,
			});
			message.success('Đổi mật khẩu thành công');
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
			title="Đổi mật khẩu"
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
					name="old_password"
					label="Mật khẩu hiện tại"
					rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
				>
					<InputPassword
						placeholder="Mật khẩu hiện tại"
						prefix={<Lock size={18} color="rgb(156 163 175)" />}
					/>
				</Form.Item>
				<Form.Item
					name="new_password"
					label="Mật khẩu mới"
					rules={[
						{ required: true, message: 'Vui lòng nhập mật khẩu mới' },
						{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
					]}
				>
					<InputPassword
						placeholder="Mật khẩu mới"
						prefix={<Lock size={18} color="rgb(156 163 175)" />}
					/>
				</Form.Item>
				<Form.Item
					name="confirm_password"
					label="Xác nhận mật khẩu"
					dependencies={['new_password']}
					rules={[
						{ required: true, message: 'Vui lòng xác nhận mật khẩu' },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('new_password') === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
							},
						}),
					]}
				>
					<InputPassword
						placeholder="Xác nhận mật khẩu"
						prefix={<Lock size={18} color="rgb(156 163 175)" />}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}
