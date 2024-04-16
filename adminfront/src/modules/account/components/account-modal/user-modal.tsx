'use client';
import { useEffect, useState } from 'react';
import { Mail, UserRound, Phone } from 'lucide-react';
import { useFormState } from 'react-dom';
import { Form, type FormProps, App } from 'antd';
import { User } from '@medusajs/medusa';

import { Modal, SubmitModal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Title } from '@/components/Typography';
import { CheckboxGroup } from '@/components/Checkbox';
import { rolesEmployee, EPermissions, IUserRequest } from '@/types/account';
import { createUser, updateUser } from '@/actions/accounts';
import { isEmpty } from 'lodash';

interface Props {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	user: Omit<User, 'password_hash'> | null;
	// setCurrentUser: () => void;
}

export default function UserModal({
	state: stateModal,
	handleOk,
	handleCancel,
	user,
}: Props) {
	const [form] = Form.useForm();
	const { message } = App.useApp();

	const titleModal = `${isEmpty(user) ? 'Thêm mới' : 'Cập nhật'} nhân viên`;

	useEffect(() => {
		form &&
			form?.setFieldsValue({
				email: user?.email ?? '',
				phone: user?.phone ?? '',
				fullName: user?.first_name ?? '',
				permissions: user?.permissions?.split(',') ?? [
					EPermissions.WarehouseStaff,
					EPermissions.WarehouseManager,
					EPermissions.Driver,
					EPermissions.InventoryChecker,
					EPermissions.AssistantDriver,
				],
			});
	}, [user, form]);

	// Submit form
	const onFinish: FormProps<IUserRequest>['onFinish'] = async (values) => {
		try {
			// Create user
			if (isEmpty(user)) {
				const result = await createUser(values);
				message.success('Đăng ký nhân viên thành công');
			} else {
				// Update user
				const result = await updateUser(user.id, values);
				message.success('Cập nhật nhân viên thành công');
			}
			handleCancel();
		} catch (error: any) {
			message.error(error?.message);
		}
	};

	const onFinishFailed: FormProps<IUserRequest>['onFinishFailed'] = (
		errorInfo
	) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<SubmitModal
			open={stateModal}
			onOk={handleOk}
			confirmLoading={false}
			handleCancel={handleCancel}
			form={form}
		>
			<Title level={3} className="text-center">
				{titleModal}
			</Title>
			<Form id="form-user" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
				<Form.Item
					labelCol={{ span: 24 }}
					name="email"
					rules={[{ required: true, message: 'Email không đúng định dạng!' }]}
					label="Email:"
				>
					<Input
						placeholder="Email"
						prefix={<Mail />}
						disabled={!isEmpty(user)}
						data-testid="email"
					/>
				</Form.Item>
				<Form.Item
					labelCol={{ span: 24 }}
					name="fullName"
					rules={[{ required: true, message: 'Tên phải có ít nhất 2 ký tự!' }]}
					label="Tên nhân viên:"
				>
					<Input
						placeholder="Tên nhân viên"
						prefix={<UserRound />}
						data-testid="fullName"
					/>
				</Form.Item>
				<Form.Item
					labelCol={{ span: 24 }}
					name="phone"
					rules={[
						{
							required: true,
							message: 'Số điện thoại phải có ít nhất 2 ký tự!',
						},
						{ min: 10, message: 'Số điện thoại phải có ' },
					]}
					label="Số diện thoại:"
				>
					<Input
						placeholder="Số điện thoại"
						prefix={<Phone />}
						data-testid="phone"
					/>
				</Form.Item>
				<Form.Item
					labelCol={{ span: 24 }}
					label="Phân quyền nhân viên"
					name="permissions"
					rules={[
						{ required: true, message: 'Nhân viên phải có ít nhất 1 vai trò!' },
					]}
				>
					<CheckboxGroup data-testid="permissions" options={rolesEmployee} />
				</Form.Item>
			</Form>
		</SubmitModal>
	);
}
