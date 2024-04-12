'use client';
import { useEffect, useState } from 'react';
import { Mail, UserRound, Phone } from 'lucide-react';
import { useFormState } from 'react-dom';
import { Form, type FormProps, App } from 'antd';
import { User } from '@medusajs/medusa';

import { Modal, SubmitModal } from '@/components/Modal';
import { InputWithLabel } from '@/components/Input';
import { Title } from '@/components/Typography';
import { CheckboxGroup } from '@/components/Checkbox';
import { rolesEmployee, ERoleEmp, IUserRequest } from '@/types/account';
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

	useEffect(() => {
		form.setFieldsValue({
			email: user?.email ?? '',
			phone: user?.phone ?? '',
			fullName: user?.first_name ?? '',
		});
	}, [user]);

	// Submit form
	const onFinish: FormProps<IUserRequest>['onFinish'] = async (values) => {
		console.log('value:', values);
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
			<Title level={3} className="text-center">{`${
				isEmpty(user) ? 'Thêm mới' : 'Cập nhật'
			} nhân viên`}</Title>
			<Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
				<Form.Item
					name="email"
					rules={[{ required: true, message: 'Email không đúng định dạng!' }]}
					label="Email:"
					initialValue={user?.email}
				>
					<InputWithLabel placeholder="Email" prefix={<Mail />} />
				</Form.Item>
				<Form.Item
					name="fullName"
					rules={[{ required: true, message: 'Tên phải có ít nhất 2 ký tự!' }]}
					label="Tên nhân viên:"
					initialValue={user?.first_name}
				>
					<InputWithLabel placeholder="Tên nhân viên" prefix={<UserRound />} />
				</Form.Item>
				<Form.Item
					name="phone"
					rules={[{ required: true, message: 'Tên phải có ít nhất 2 ký tự!' }]}
					label="Số diện thoại:"
					initialValue={user?.phone}
				>
					<InputWithLabel placeholder="Số điện thoại" prefix={<Phone />} />
				</Form.Item>
				<Form.Item
					label="Phân quyền nhân viên"
					name="rolesUser"
					rules={[{ required: true, message: 'Tên phải có ít nhất 2 ký tự!' }]}
					initialValue={[
						ERoleEmp.WarehouseStaff,
						ERoleEmp.WarehouseManager,
						ERoleEmp.Driver,
						ERoleEmp.InventoryChecker,
						ERoleEmp.AssistantDriver,
					]}
				>
					<CheckboxGroup options={rolesEmployee} />
				</Form.Item>
			</Form>
		</SubmitModal>
	);
}
