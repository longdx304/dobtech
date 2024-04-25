'use client';
import { User } from '@medusajs/medusa';
import { Modal, message } from 'antd';
import { CircleAlert, Plus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { deleteUser } from '@/actions/accounts';
import { FloatButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { updateSearchQuery } from '@/lib/utils';
import { UserModal } from '@/modules/account/components/account-modal';
import { TResponse } from '@/types/common';
import accountColumns from './account-column';
import { IAdminResponse } from '@/types/account';

interface Props {
	data: TResponse<IAdminResponse> | null;
}

const AccountList = ({ data }: Props) => {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();
	const currentPage = searchParams.get('page') ?? 1;

	const { state, onOpen, onClose } = useToggleState(false);
	const [currentUser, setCurrentUser] = useState<IAdminResponse | null>(null);

	const handleEditUser = (record: IAdminResponse) => {
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
				try {
					await deleteUser(userId);
					message.success('Xoá nhân viên thành công!');
				} catch (error) {
					message.error('Xoá nhân viên thất bại!');
				}
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	};

	const handleChangePage = (page: number) => {
		// create new search params with new value
		const newSearchParams = updateSearchQuery(searchParams, {
			page: page.toString(),
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
				dataSource={data?.data ?? []}
				rowKey="id"
				pagination={{
					total: Math.floor(data?.count ?? 0 / (data?.limit ?? 0)),
					pageSize: data?.limit,
					current: currentPage as number,
					onChange: handleChangePage,
				}}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" />}
				type="primary"
				onClick={onOpen}
				data-testid="btnCreateAccount"
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
