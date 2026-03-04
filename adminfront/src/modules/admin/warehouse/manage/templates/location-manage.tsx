'use client';
import { Button, FloatButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Text, Title } from '@/components/Typography';
import {
	useAdminDeleteWarehouse,
	useAdminWarehouses,
} from '@/lib/hooks/api/warehouse';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import { Warehouse, WarehouseInventory } from '@/types/warehouse';
import { Modal as AntdModal, message } from 'antd';
import debounce from 'lodash/debounce';
import { ActionAbles } from '@/components/Dropdown';
import { Minus, Pen, Plus, Search, Trash2 } from 'lucide-react';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
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
	const [warehouseData, setWarehouseData] = useState<Warehouse>();
	const [warehouseInventory, setWarehouseInventory] =
		useState<WarehouseInventory>();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

	const {
		warehouse,
		isLoading: warehouseLoading,
		count,
	} = useAdminWarehouses({
		q: searchValue || undefined,
		expand:
			'inventories,inventories.variant,inventories.item_unit,inventories.variant.product',
		limit: DEFAULT_PAGE_SIZE,
		offset,
		order: '-inventories.updated_at',
	});

	useEffect(() => {
		if (warehouse?.length) {
			const keys = warehouse.map((item) => item.id);
			setExpandedKeys(keys);
		}
	}, [warehouse]);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const handleEditWarehouse = (item: Warehouse) => {
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
	const handleAddInventory = (item: WarehouseInventory) => {
		item && item.item_unit && setSelectedUnit(item.item_unit.id);
		setQuantity(1);
		setWarehouseInventory(item);
		setInventoryType('INBOUND');
		openInventory();
	};
	// Remove variant inventory
	const handleRemoveInventory = (item: WarehouseInventory) => {
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

	const expandedRowRender = (record: Warehouse) => {
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
			<Flex vertical align="flex-start" className="">
				<Title level={3}>Danh sách vị trí kho</Title>
				<Text className="text-gray-600">
					Trang danh sách các sản phẩm ở từng vị trí kho.
				</Text>
			</Flex>
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
								prev.length ? [] : warehouse?.map((item) => item.id) || []
							);
						}}
					>
						{expandedKeys.length ? 'Ẩn vị trí' : 'Hiển thị vị trí'}
					</Button>
				</Flex>
				<Table
					dataSource={warehouse}
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
						scroll={{ x: 'max-content' }}
					/>
				</div>
				<div className="block md:hidden">
					{displayWarehouse?.map((item) => (
						<div
							key={item.id}
							className="mb-3 rounded-md border p-3 shadow-sm flex flex-col gap-2"
						>
							<Flex className="items-center justify-between gap-2">
								<Flex vertical className="min-w-0">
									<Text className="text-sm font-semibold break-words">
										{item.location}
									</Text>
									<Text className="text-xs text-gray-500">
										{item.inventories?.length ?? 0} sản phẩm
									</Text>
								</Flex>
								<ActionAbles
									actions={[
										{
											label: 'Thêm sản phẩm',
											icon: <Pen size={20} />,
											onClick: () => handleEditWarehouse(item),
										},
										{
											label: 'Xoá vị trí',
											icon: <Trash2 size={20} />,
											danger: true,
											onClick: () => handleRemoveWarehouse(item.id),
										},
									] as any}
								/>
							</Flex>

							{item.inventories?.map((inv) => {
								const baseQuantity =
									inv.item_unit?.quantity && inv.item_unit.quantity > 0
										? inv.quantity / inv.item_unit.quantity
										: inv.quantity;

								return (
									<div
										key={inv.id}
										className="mt-2 flex items-center justify-between gap-2 border-t pt-2 first:mt-0 first:border-t-0"
									>
										<div className="min-w-0">
											<p className="text-xs font-medium break-words">
												{inv.variant?.product?.title} - {inv.variant?.title}
											</p>
											<p className="text-[11px] text-gray-500">
												{baseQuantity}{' '}
												{inv.item_unit?.unit
													? `${inv.item_unit.unit} (${inv.quantity} đôi)`
													: inv.quantity}
											</p>
										</div>
										<div className="flex items-center gap-3">
											<Minus
												onClick={() => handleRemoveInventory(inv)}
												size={18}
												color="red"
												className="cursor-pointer"
											/>
											<Plus
												onClick={() => handleAddInventory(inv)}
												size={18}
												color="green"
												className="cursor-pointer"
											/>
										</div>
									</div>
								);
							})}
						</div>
					))}
				{displayCount > DEFAULT_PAGE_SIZE && (
					<div className="mt-4 pb-20 flex justify-center">
						<Pagination
							simple
							current={numPages}
							pageSize={DEFAULT_PAGE_SIZE}
							total={displayCount}
							onChange={handleChangePage}
							showTotal={(total, range) =>
								`${range[0]}-${range[1]} trong ${total} vị trí`
							}
						/>
					</div>
				)}
				</div>
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
						warehouseInventory={warehouseInventory}
					/>
				)}
			</Card>
		</Flex>
	);
};

export default LocationManage;
