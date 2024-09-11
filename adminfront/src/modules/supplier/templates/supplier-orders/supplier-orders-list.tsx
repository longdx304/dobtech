import { FloatButton } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Title } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { SupplierOrders } from '@/types/supplier';
import _ from 'lodash';
import { Plus, Search } from 'lucide-react';
import { useAdminProducts } from 'medusa-react';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import SupplierOrdersModal from '../../components/supplier-orders-modal';
import { useAdminSuppliers } from '../../hooks';
import supplierOrdersColumn from './supplier-orders-column';

type Props = {};

const DEFAULT_PAGE_SIZE = 10;

const SupplierOrdersList: FC<Props> = () => {
	const {
		state: stateSupplierOrdersModal,
		onOpen: openSupplierOrdersModal,
		onClose: closeSupplierOrdersModal,
	} = useToggleState(false);

	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [currentSupplierOrders, setCurrentSupplierOrders] =
		useState<SupplierOrders | null>(null);
	const [supplierId, setSupplierId] = useState<string | null>(null);

	const { products, isLoading: isLoadingProducts } = useAdminProducts();
	const { data, isLoading: isLoadingSuppliers } = useAdminSuppliers({
		q: '',
		offset,
		limit: DEFAULT_PAGE_SIZE,
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

	const handleEditSupplierOrders = (record: SupplierOrders) => {
		setCurrentSupplierOrders(record);
		openSupplierOrdersModal();
	};

	const handleCreateSupplierOrders = () => {
		setCurrentSupplierOrders(null);
		openSupplierOrdersModal();
	};

	const handleDeleteSupplierOrders = (record: SupplierOrders['id']) => {};

	const columns = useMemo(() => {
		return supplierOrdersColumn({
			handleEditSupplierOrders,
			handleDeleteSupplierOrders,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// mock data
	const [supplierOrders, setSupplierOrders] = useState<SupplierOrders[]>([]);

	useEffect(() => {
		// Simulating API call to fetch supplier orders
		const fetchSupplierOrders = async () => {
			// Replace this with actual API call
			const mockData: SupplierOrders[] = [
				{
					id: '1',
					display_id: 1,
					supplier_id: 'supplier1',
					user_id: 'user1',
					cart_id: 'cart1',
					status: 'pending',
					payment_status: 'awaiting',
					fulfillment_status: 'not_fulfilled',
					estimated_production_time: '7 days',
					settlement_time: '30 days',
					tax_rate: 0.1,
					metadata: {},
					created_at: '2024-03-15T00:00:00Z',
					updated_at: '2024-03-15T00:00:00Z',
				},
			];
			setSupplierOrders(mockData);
		};

		fetchSupplierOrders();
	}, []);

	const handleCloseModal = () => {
		closeSupplierOrdersModal();
		setCurrentSupplierOrders(null);
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
				loading={false}
				columns={(columns as any) ?? []}
				dataSource={supplierOrders}
				rowKey="id"
				scroll={{ x: 700 }}
				pagination={{
					total: supplierOrders.length,
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
					// supplierOrders={currentSupplierOrders}
					products={products || []}
					suppliers={data?.suppliers || []}
				/>
			)}
		</div>
	);
};

export default SupplierOrdersList;
