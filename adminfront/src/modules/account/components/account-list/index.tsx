'use client';
import { User } from '@medusajs/medusa';
import { Modal, message } from 'antd';
import { CircleAlert, Plus, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useAdminDeleteUser } from 'medusa-react';

import { FloatButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import useToggleState from '@/lib/hooks/use-toggle-state';
import useAdminAction from '@/lib/hooks/useAdminAction';
import { updateSearchQuery } from '@/lib/utils';
import { UserModal } from '@/modules/account/components/account-modal';
import { IAdminResponse } from '@/types/account';
import accountColumns from './account-column';
import { TResponse } from '@/types/common';
import { useAdminUsers } from 'medusa-react';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Title } from '@/components/Typography';

interface Props {
	// data: TResponse<IAdminResponse> | null;
}

const AccountList = ({}: Props) => {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();

	const PAGE_SIZE = 10;

	const [currentPage, setCurrentPage] = useState(1);
	const [searchValue, setSearchValue] = useState('');
	const { users, count, isLoading, isRefetching } = useAdminUsers({
		limit: PAGE_SIZE,
		offset: (currentPage - 1) * PAGE_SIZE,
		q: searchValue || undefined,
	});

	const { state, onOpen, onClose } = useToggleState(false);
	const [currentUser, setCurrentUser] = useState<IAdminResponse | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const deleteUser = useAdminDeleteUser(userId);

	const handleEditUser = (record: IAdminResponse) => {
		setCurrentUser(record);
		onOpen();
	};

	const handleCloseModal = () => {
		setCurrentUser(null);
		onClose();
	};

	const handleDeleteUser = (userId: User['id']) => {
		setUserId(userId);
		if (userId) {
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
				confirmLoading: deleteUser?.isLoading,
				async onOk() {
					deleteUser.mutateAsync(void 0, {
						onSuccess: () => {
							setUserId(null);
							message.success('Xoá nhân viên thành công!');
							return;
						},
						onError: () => {
							message.error('Xoá nhân viên thất bại!');
							return;
						},
					});
					// setUserId(null);
				},
				onCancel() {
					setUserId(null);
				},
			});
		}
	};

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
	};

	
	const columns = useMemo(
		() => accountColumns({ handleDeleteUser, handleEditUser }),
		[users]
	);

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;

			// Update search query
			setSearchValue(inputValue);
		},
		500
	);

	return (
		<Card className="w-full">
			<Flex align="center" justify="flex-start" className="">
				<Title level={3}>Quản lý nhân viên</Title>
			</Flex>
			<Flex align="center" justify="flex-end" className="pb-4">
				<Input
					// size="small"
					placeholder="Tìm kiếm nhân viên..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={isLoading || isRefetching}
				columns={columns}
				dataSource={users}
				rowKey="id"
				pagination={{
					total: Math.floor(count ?? 0 / (PAGE_SIZE ?? 0)),
					pageSize: PAGE_SIZE,
					current: currentPage as number,
					onChange: handleChangePage,
				}}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" size={20} strokeWidth={2} />}
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
