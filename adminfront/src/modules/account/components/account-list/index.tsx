'use client';
import { Plus, CircleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { User } from '@medusajs/medusa';
import { App } from 'antd';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Card } from '@/components/Card';
import Table from '@/components/Table';
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
	const { message, modal } = App.useApp();

	const handleEditUser = (record: IAdminResponse) => {
		setCurrentUser(record);
		onOpen();
	};

	const handleCloseModal = () => {
		setCurrentUser(null);
		onClose();
	};

	const handleDeleteUser = (userId: User['id']) => {
		modal.confirm({
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
				className="top-2/3"
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
