'use client';
import { Button, FloatButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Text, Title } from '@/components/Typography';
import {
	useAdminDeleteWarehouse,
	useAdminWarehousesKiot,
} from '@/lib/hooks/api/warehouse';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import { WarehouseKiot, WarehouseKiotInventory } from '@/types/kiot';
import { Modal as AntdModal, message } from 'antd';
import debounce from 'lodash/debounce';
import { Plus, Search } from 'lucide-react';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import ModalAddVariantWarehouse from '../components/modal-add-variant-warehouse';
import ModalAddWarehouse from '../components/modal-add-warehouse';
import ModalVariantInventory from '../components/modal-variant-inventory';
import { expandedColumns, warehouseColumns } from './location-columns';

type Props = {};

const DEFAULT_PAGE_SIZE = 20;

const LocationManage: FC<Props> = ({}) => {
	const deleteWarehouse = useAdminDeleteWarehouse();
	const { setSelectedUnit, setQuantity } = useProductUnit();
	const {
		state: stateInventory,
		onOpen: openInventory,
		onClose: closeInventory,
	} = useToggleState(false);
	const {
		state: stateVariantInventory,
		onOpen: openVariantInventory,
		onClose: closeVariantInventory,
	} = useToggleState(false);
	const {
		state: stateWarehouse,
		onOpen: openWarehouse,
		onClose: closeWarehouse,
	} = useToggleState(false);

	const [inventoryType, setInventoryType] = useState<string>('');
	const [warehouseData, setWarehouseData] = useState<WarehouseKiot>();
	const [warehouseInventory, setWarehouseInventory] =
		useState<WarehouseKiotInventory>();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

	const {
		warehouses,
		isLoading: warehouseLoading,
		count,
	} = useAdminWarehousesKiot({
		q: searchValue ?? undefined,
		expand: 'inventories,inventories.item_unit,inventories.warehouse',
		limit: DEFAULT_PAGE_SIZE,
		offset: offset,
	});

	useEffect(() => {
		if (warehouses?.length) {
			const keys = warehouses.map((item) => item.id);
			setExpandedKeys(keys);
		}
	}, [warehouses]);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const handleEditWarehouse = (item: WarehouseKiot) => {
		setQuantity(1);
		setWarehouseData(item);
		openVariantInventory();
	};

	const handleRemoveWarehouse = (id: string) => {
		AntdModal.confirm({
			title: 'Xác nhận xoá vị trí kho',
			content: 'Bạn có chắc chắn muốn xoá vị trí kho hiện tại?',
			onOk: async () => {
				await deleteWarehouse.mutateAsync(id, {
					onSuccess: () => {
						message.success('Xoá vị trí thành công');
					},
					onError: (error: any) => {
						message.error(getErrorMessage(error));
					},
				});
			},
		});
	};

	const columns = warehouseColumns({
		handleEditWarehouse,
		handleRemoveWarehouse,
	});

	// Add variant inventory
	const handleAddInventory = (item: WarehouseKiotInventory) => {
		item && item.item_unit && setSelectedUnit(item.item_unit.id);
		setQuantity(1);
		setWarehouseInventory(item);
		setInventoryType('INBOUND');
		openInventory();
	};
	// Remove variant inventory
	const handleRemoveInventory = (item: WarehouseKiotInventory) => {
		item && item.item_unit && setSelectedUnit(item.item_unit.id);
		setQuantity(1);
		setWarehouseInventory(item);
		setInventoryType('OUTBOUND');
		openInventory();
	};

	// Close modal variant inventory
	const handleCloseModal = () => {
		closeInventory();
		setInventoryType('');
		setQuantity(1);
		setWarehouseInventory(undefined);
	};

	const expandColumns = expandedColumns({
		handleAddInventory,
		handleRemoveInventory,
	});

	const expandedRowRender = (record: WarehouseKiot) => {
		if (!record.inventories?.length) return null;

		return (
			<Table
				columns={expandColumns as any}
				dataSource={record.inventories}
				rowKey="id"
				pagination={false}
			/>
		);
	};

	return (
		<Flex vertical gap={12}>
			<Card loading={false} className="w-full" bordered={false}>
				{/* <Title level={4}>Vị trí kho</Title> */}
				<Flex align="center" justify="flex-end" className="py-4">
					<Input
						placeholder="Tìm kiếm vị trí hoặc sản phẩm..."
						name="search"
						prefix={<Search size={16} />}
						onChange={handleChangeDebounce}
						className="w-[300px] mr-2"
					/>
					<Button
						type="dashed"
						onClick={() => {
							setExpandedKeys((prev) =>
								prev.length ? [] : warehouses?.map((item) => item.id) || []
							);
						}}
					>
						{expandedKeys.length ? 'Ẩn vị trí' : 'Hiển thị vị trí'}
					</Button>
				</Flex>
				<Table
					dataSource={warehouses}
					expandable={{
						expandedRowRender: expandedRowRender as any,
						expandedRowKeys: expandedKeys,
						onExpandedRowsChange: (keys) => {
							setExpandedKeys(keys as string[]);
						},
					}}
					loading={warehouseLoading}
					rowKey="id"
					columns={columns as any}
					pagination={
						(count ?? 0) > DEFAULT_PAGE_SIZE && {
							onChange: (page) => handleChangePage(page),
							pageSize: DEFAULT_PAGE_SIZE,
							current: numPages || 1,
							total: count,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} trong ${total} vị trí`,
						}
					}
				/>
				<FloatButton
					icon={<Plus color="white" size={20} strokeWidth={2} />}
					type="primary"
					onClick={openWarehouse}
				/>
				{warehouseData && (
					<ModalAddVariantWarehouse
						isModalOpen={stateVariantInventory}
						onClose={closeVariantInventory}
						warehouse={warehouseData}
					/>
				)}
				{stateWarehouse && (
					<ModalAddWarehouse
						isModalOpen={stateWarehouse}
						onClose={closeWarehouse}
					/>
				)}
				{warehouseInventory && (
					<ModalVariantInventory
						isModalOpen={stateInventory}
						inventoryType={inventoryType}
						onClose={handleCloseModal}
						warehouseInventory={warehouseInventory as any}
					/>
				)}
			</Card>
		</Flex>
	);
};

export default LocationManage;
