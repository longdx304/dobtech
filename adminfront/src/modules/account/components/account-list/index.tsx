'use client';
import { Plus, CircleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { User } from '@medusajs/medusa';
import { Modal } from 'antd';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { FloatButton } from '@/components/Button';
import { Title } from '@/components/Typography';
import { Input } from '@/components/Input';
import { SubmitButton } from '@/components/Button';
import { UserModal } from '@/modules/account/components/account-modal';
import accountColumns from './account-column';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { TResponse } from '@/types/common';
import { deleteUser } from '@/actions/accounts';
import { updateSearchQuery } from '@/lib/utils';

interface Props {
	data: TResponse<Omit<User, 'password_hash'>> | null;
}

const AccountList = ({ data }: Props) => {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();
	const currentPage = searchParams.get('page') ?? 1;

	const { state, onOpen, onClose } = useToggleState(false);
	const [currentUser, setCurrentUser] = useState<Omit<
		User,
		'password_hash'
	> | null>(null);

	const handleEditUser = (record: User) => {
		setCurrentUser(record);
		onOpen();
	};

	const handleCloseModal = () => {
		setCurrentUser(null);
		onClose();
	};

	const handleDeleteUser = (userId: User['id']) => {
		Modal.confirm({
			title: 'Bạn có muốn xoá nhân viên này không ?',
			content:
				'Nhân viên sẽ bị xoá khỏi hệ thống này. Bạn chắc chắn muốn xoá nhân viên này chứ?',
			icon: (
				<CircleAlert
					style={{ width: 32, height: 24 }}
					className="mr-2"
					color="#E7B008"
				/>
			),
			okType: 'danger',
			okText: 'Đồng ý',
			cancelText: 'Huỷ',
			async onOk() {
				await deleteUser(userId);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	};

	const handleChangePage = (page: number) => {
		console.log('page', page);
		// create new search params with new value
		const newSearchParams = updateSearchQuery(searchParams, {
			page: page,
		});

		// Replace url
		replace(`${pathname}?${newSearchParams}`);
	};

	const columns = useMemo(
		() => accountColumns({ handleDeleteUser, handleEditUser }),
		[data]
	);

	return (
		<Card className="w-full">
			<Table
				columns={columns}
				dataSource={data?.users ?? []}
				rowKey="id"
				pagination={{
					total: Math.floor(data.count / data.limit),
					pageSize: data.limit,
					current: currentPage,
					onChange: handleChangePage,
				}}
				// onRow={(record, rowIndex) => ({
				// 	onClick: (event) => onClickRow(record),
				// })}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" />}
				type="primary"
				onClick={onOpen}
			/>
			<UserModal
				state={state}
				handleOk={onClose}
				handleCancel={handleCloseModal}
				user={currentUser}
			/>
		</Card>
	);
};

export default AccountList;
