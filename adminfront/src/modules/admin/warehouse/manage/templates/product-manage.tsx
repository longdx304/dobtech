'use client';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { ProductVariant } from '@/types/products';
import { Warehouse, WarehouseInventory } from '@/types/warehouse';
import debounce from 'lodash/debounce';
import { ActionAbles } from '@/components/Dropdown';
import { History, Minus, Pen, Plus, Search } from 'lucide-react';
import { useAdminVariants, useMedusa } from 'medusa-react';
import * as XLSX from 'xlsx';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import ModalAddVariant from '../components/modal-add-variant';
import ModalVariantInventory from '../components/modal-variant-inventory';
import { expandedColumns, productColumns } from './product-columns';
import ModalTransactionHistory from '../components/modal-transaction-history';
import Image from 'next/image';
import { Typography, Pagination } from 'antd';

const { Text } = Typography;

type Props = {};

const DEFAULT_PAGE_SIZE = 20;

// Helper function to sort inventories by location priority
const sortInventoriesByLocationPriority = (inventories: WarehouseInventory[]) => {
	return [...inventories].sort((a, b) => {
		const locationA = a.warehouse?.location || '';
		const locationB = b.warehouse?.location || '';
		return locationA.localeCompare(locationB);
	});
};

const ProductManage: FC<Props> = ({}) => {
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
		state: stateTransactionHistory,
		onOpen: openTransactionHistory,
		onClose: closeTransactionHistory,
	} = useToggleState(false);

	const { client } = useMedusa();
	const [isExporting, setIsExporting] = useState<boolean>(false);

	const [inventoryType, setInventoryType] = useState<string>('');
	const [variant, setVariant] = useState<ProductVariant>();
	const [variantId, setVariantId] = useState<string>('');
	const [warehouseInventory, setWarehouseInventory] =
		useState<WarehouseInventory>();
	const [searchValue, setSearchValue] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);
	const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

	const { variants, isLoading, count, refetch } = useAdminVariants({
		q: searchValue || undefined,
		limit: DEFAULT_PAGE_SIZE,
		offset: offset,
		expand: 'product,inventories,inventories.item_unit,inventories.warehouse',
	});

	useEffect(() => {
		if (variants?.length) {
			const keys = variants.map((item) => item.id);
			setExpandedKeys(keys as string[]);
		}
	}, [variants]);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const handleEditWarehouse = (item: ProductVariant) => {
		setQuantity(1);
		setVariant(item);
		openVariantInventory();
	};
	const handleOpenTransactionHistory = (id: string) => {
		setVariantId(id);
		openTransactionHistory();
	};
	const columns = productColumns({
		handleEditWarehouse,
		handleOpenTransactionHistory,
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

	const handleExportExcel = async () => {
		setIsExporting(true);
		try {
			const { variants } = await client.admin.variants.list({
				limit: 9999,
				expand:
					'product,inventories,inventories.item_unit,inventories.warehouse',
			});

			const data = variants.flatMap((variant: any) => {
				if (!variant.inventories?.length) return [];

				return variant.inventories.map((inv: any) => ({
					'Mã': variant.sku,
					'Model': `${variant.product?.title || ''} - ${variant.title}`,
					'Số lượng': inv.quantity,
					'Vị trí': inv.warehouse?.location,
				}));
			});

			if (data.length === 0) {
				// alert('Không có dữ liệu phù hợp');
				return;
			}

			const ws = XLSX.utils.json_to_sheet(data);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, 'Danh sách');
			XLSX.writeFile(wb, 'danh-sach-san-pham.xlsx');
		} catch (error) {
			console.error('Export error:', error);
		} finally {
			setIsExporting(false);
		}
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

	// Use variants for display
	const displayVariants = variants || [];
	const displayCount = count || 0;

	return (
		<Flex vertical gap={12}>
			<Flex align="center" justify="flex-end" className="py-4">
				<Input
					placeholder="Tìm kiếm vị trí hoặc sản phẩm..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px] mr-2"
				/>
				<Button
					type="default"
					className="mr-2"
					onClick={handleExportExcel}
					loading={isExporting}
				>
					Xuất Excel
				</Button>
				<Button
					type="dashed"
					onClick={() => {
						setExpandedKeys((prev) =>
							prev.length
								? []
								: (variants?.map((item) => item.id) as string[]) || []
						);
					}}
				>
					{expandedKeys.length ? 'Ẩn vị trí' : 'Hiển thị vị trí'}
				</Button>
			</Flex>

			<div className="hidden md:block">
				<Table
					dataSource={variants}
					expandable={{
						expandedRowRender: expandedRowRender as any,
						expandedRowKeys: expandedKeys,
						onExpandedRowsChange: (keys) => {
							setExpandedKeys(keys as string[]);
						},
					}}
					loading={isLoading}
					rowKey="id"
					columns={columns as any}
					pagination={
						(count ?? 0) > DEFAULT_PAGE_SIZE
							? {
									onChange: (page) => handleChangePage(page),
									pageSize: DEFAULT_PAGE_SIZE,
									current: numPages || 1,
									total: count,
									showTotal: (total, range) =>
										`${range[0]}-${range[1]} trong ${total} sản phẩm`,
							  }
							: false
					}
					scroll={{ x: 'max-content' }}
				/>
			</div>

			<div className="block md:hidden">
				{displayVariants?.map((variantItem) => {
					const sortedInventories = sortInventoriesByLocationPriority(
						(variantItem as any).inventories ?? []
					);
					return (
						<Flex
							key={variantItem.id}
							vertical
							className="mb-3 rounded-md border p-3 shadow-sm gap-2"
						>
							<Flex className="items-center justify-between gap-2">
								<Flex className="items-center gap-3 min-w-0">
									<Image
										src={
											variantItem.product?.thumbnail ?? '/images/product-img.png'
										}
										alt="Product variant Thumbnail"
										width={40}
										height={50}
										className="rounded-md shrink-0"
									/>
									<Flex vertical className="min-w-0">
										<Text className="text-sm font-semibold break-words">
											{variantItem.product?.title} - {variantItem.title}
										</Text>
										<Text className="text-xs text-gray-500 break-words">
											SKU: {variantItem.sku}
										</Text>
									</Flex>
								</Flex>
								<ActionAbles
									actions={
										[
											{
												label: 'Thêm vị trí vào',
												icon: <Pen size={20} />,
												onClick: () => handleEditWarehouse(variantItem as any),
											},
											{
												label: 'Lịch sử kho',
												icon: <History size={20} />,
												onClick: () =>
													handleOpenTransactionHistory(variantItem.id ?? ''),
											},
										] as any
									}
								/>
							</Flex>

							{sortedInventories.length ? (
								<Flex vertical className="mt-2 gap-2">
									{sortedInventories.map((inv: WarehouseInventory) => {
										const baseQuantity =
											inv.item_unit?.quantity && inv.item_unit.quantity > 0
												? inv.quantity / inv.item_unit.quantity
												: inv.quantity;

										return (
											<Flex
												key={inv.id}
												className="items-center justify-between gap-2 border-t pt-2 first:mt-0 first:border-t-0"
											>
												<Flex vertical className="min-w-0">
													<Text className="text-xs font-medium break-words">
														Vị trí: {inv.warehouse?.location}
													</Text>
													<Text className="text-[11px] text-gray-500">
														{baseQuantity}{' '}
														{inv.item_unit?.unit
															? `${inv.item_unit.unit} (${inv.quantity} đôi)`
															: inv.quantity}
													</Text>
												</Flex>
												<Flex className="items-center gap-3">
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
												</Flex>
											</Flex>
										);
									})}
								</Flex>
							) : (
								<Text className="text-xs text-gray-500">
									Chưa có vị trí kho cho sản phẩm này.
								</Text>
							)}
						</Flex>
					);
				})}
				{displayCount > DEFAULT_PAGE_SIZE && (
					<div className="mt-4 pb-20 flex justify-center">
						<Pagination
							simple
							current={numPages}
							pageSize={DEFAULT_PAGE_SIZE}
							total={displayCount}
							onChange={handleChangePage}
							showTotal={(total, range) =>
								`${range[0]}-${range[1]} trong ${total} sản phẩm`
							}
						/>
					</div>
				)}
			</div>
			{variant && (
				<ModalAddVariant
					isModalOpen={stateVariantInventory}
					onClose={closeVariantInventory}
					variant={variant}
					refetch={refetch}
				/>
			)}
			{warehouseInventory && (
				<ModalVariantInventory
					isModalOpen={stateInventory}
					inventoryType={inventoryType}
					onClose={handleCloseModal}
					warehouseInventory={warehouseInventory}
					refetch={refetch}
				/>
			)}
			{variantId && (
				<ModalTransactionHistory
					isModalOpen={stateTransactionHistory}
					onClose={closeTransactionHistory}
					id={variantId}
				/>
			)}
		</Flex>
	);
};

export default ProductManage;