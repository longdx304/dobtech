import { FloatButton } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { SupplierOrders } from '@/types/supplier';
import _ from 'lodash';
import { Plus, Search } from 'lucide-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import SupplierOrdersModal from '../../components/supplier-orders-modal';
import { useAdminSupplierOrders, useAdminSuppliers } from '../../hooks';
import supplierOrdersColumn from './supplier-orders-column';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const SupplierOrdersList: FC<Props> = () => {
	const {
		state: stateSupplierOrdersModal,
		onOpen: openSupplierOrdersModal,
		onClose: closeSupplierOrdersModal,
	} = useToggleState(false);

	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [currentSupplierOrders, setCurrentSupplierOrders] =
		useState<SupplierOrders | null>(null);

	const {
		data: dataSupplierOrders,
		isLoading,
		isRefetching,
	} = useAdminSupplierOrders({
		q: searchValue || '',
		offset,
		limit: DEFAULT_PAGE_SIZE,
	});

	const { data: dataSuppliers } = useAdminSuppliers({
		q: '',
		offset: 0,
		limit: 100,
	});

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

	const handleCreateSupplierOrders = () => {
		setCurrentSupplierOrders(null);
		openSupplierOrdersModal();
	};

	const columns = useMemo(() => {
		return supplierOrdersColumn({
			supplier: dataSuppliers?.suppliers ?? [],
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataSuppliers]);

	const handleCloseModal = () => {
		closeSupplierOrdersModal();
		setCurrentSupplierOrders(null);
	};

	const handleRowClick = (record: any) => {
		router.push(`${ERoutes.SUPPLIERS}/${record.id}`);
	};

	return (
		<div className="w-full">
			<Flex align="center" justify="flex-start" className="">
				<Title level={3}>Đơn đặt hàng</Title>
			</Flex>
			<Flex align="center" justify="flex-end" className="pb-4">
				<Input
					placeholder="Tìm kiếm đơn đặt hàng..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px]"
				/>
			</Flex>
			<Table
				loading={isLoading || isRefetching}
				columns={(columns as any) ?? []}
				dataSource={dataSupplierOrders?.supplierOrder ?? []}
				rowKey="id"
				onRow={(record) => ({
					onClick: () => handleRowClick(record),
					className: 'cursor-pointer',
				})}
				scroll={{ x: 700 }}
				pagination={{
					total: dataSupplierOrders?.count ?? 0,
					pageSize: DEFAULT_PAGE_SIZE,
					current: numPages,
					onChange: handleChangePage,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} trong ${total} nhà cung cấp`,
				}}
			/>
			<FloatButton
				className="absolute"
				icon={<Plus color="white" size={20} strokeWidth={2} />}
				type="primary"
				onClick={handleCreateSupplierOrders}
				data-testid="btnCreateSupplier"
			/>
			{stateSupplierOrdersModal && (
				<SupplierOrdersModal
					state={stateSupplierOrdersModal}
					handleOk={handleCloseModal}
					handleCancel={handleCloseModal}
					suppliers={dataSuppliers?.suppliers || []}
				/>
			)}
		</div>
	);
};

export default SupplierOrdersList;
