'use client';
import { Mail, UserRound, Phone } from 'lucide-react';
import { useFormState } from 'react-dom';

import { Modal, SubmitModal } from '@/components/Modal';
import { InputWithLabel } from '@/components/Input';
import { Title, Text } from '@/components/Typography';
import { Flex } from '@/components/Flex';
import { CheckboxGroup } from '@/components/Checkbox';
import { rolesEmployee, ERoleEmp } from '@/types/account';
import { createMember } from '@/services/accounts';

interface Props {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
}

const AccountModal = ({ state: stateModal, handleOk, handleCancel }: Props) => {
	const [state, formAction] = useFormState(createMember, null);
	console.log('state', state);
	return (
		<SubmitModal
			open={stateModal}
			onOk={handleOk}
			confirmLoading={false}
			handleCancel={handleCancel}
			formAction={formAction}
		>
			<Title level={3} className="text-center">{`Thêm mới nhân viên`}</Title>
			<InputWithLabel
				label="Email:"
				name="email"
				placeholder="Email"
				prefix={<Mail />}
				error={state?.email}
			/>
			<InputWithLabel
				label="Tên nhân viên:"
				name="fullName"
				placeholder="Tên nhân viên"
				prefix={<UserRound />}
				error={state?.fullName}
			/>
			<InputWithLabel
				label="Số diện thoại:"
				name="phone"
				placeholder="Số điện thoại"
				prefix={<Phone />}
				error={state?.phone}
			/>
			<Flex vertical gap="small">
				<Text strong>{'Phân quyền nhân viên'}</Text>
				<CheckboxGroup
					name="rolesEmp"
					options={rolesEmployee}
					defaultValue={[ERoleEmp.WarehouseStaff]}
					error={state?.rolesEmp}
				/>
			</Flex>
		</SubmitModal>
	);
};

export default AccountModal;
