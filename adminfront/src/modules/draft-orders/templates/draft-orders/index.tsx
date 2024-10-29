'use client';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { ERoutes } from '@/types/routes';
import _ from 'lodash';
import { Plus, Search } from 'lucide-react';
import { useAdminDraftOrders } from 'medusa-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import draftOrderColumns from './draft-order-column';
import { FloatButton } from '@/components/Button';
import useToggleState from '@/lib/hooks/use-toggle-state';
import DraftOrderModal from '../../components/draft-order-modal';
import NewDraftOrderFormProvider from '../../hooks/use-new-draft-form';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const DraftOrderList: FC<Props> = () => {
	const router = useRouter();

	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);

	const {
		state: stateDraftOrdersModal,
		onOpen: openDraftOrdersModal,
		onClose: closeDraftOrdersModal,
	} = useToggleState(false);

	const { draft_orders, isLoading, count } = useAdminDraftOrders(
		{
			q: searchValue || undefined,
			offset,
			limit: DEFAULT_PAGE_SIZE,
		},
		{
			keepPreviousData: true,
		}
	);

	const handleChangeDebounce = _.debounce(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value: inputValue } = e.target;
			setSearchValue(inputValue);
		},
		500
	);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const columns = useMemo(() => {
		return draftOrderColumns({});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [draft_orders]);

	const handleRowClick = (record: any) => {
		router.push(`${ERoutes.DRAFT_ORDERS}/${record.id}`);
	};

	const handleCreateDraftOrder = () => {
		openDraftOrdersModal();
	};

	const handleCancelDraftOrder = () => {
		closeDraftOrdersModal();
	};

	return (
		<div className="w-full">
			<Flex align="center" justify="flex-end" className="pb-4">
				<Input
					// size="small"
					placeholder="Tìm kiếm đơn hàng..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={isLoading}
				columns={columns as any}
				dataSource={draft_orders ?? []}
				rowKey="id"
				scroll={{ x: 700 }}
				onRow={(record) => ({
					onClick: () => handleRowClick(record),
					className: 'cursor-pointer',
				})}
				pagination={{
					total: Math.floor(count ?? 0 / (DEFAULT_PAGE_SIZE ?? 0)),
					pageSize: DEFAULT_PAGE_SIZE,
					current: numPages || 1,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} đơn hàng`,
				}}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" size={20} strokeWidth={2} />}
				type="primary"
				onClick={handleCreateDraftOrder}
				data-testid="btnCreateSupplier"
			/>
			{stateDraftOrdersModal && (
				<NewDraftOrderFormProvider>
					<DraftOrderModal
						state={stateDraftOrdersModal}
						handleOk={handleCancelDraftOrder}
						handleCancel={handleCancelDraftOrder}
					/>
				</NewDraftOrderFormProvider>
			)}
		</div>
	);
};

export default DraftOrderList;
