'use client';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Image } from '@/components/Image';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { ProductVariant } from '@/types/products';
import { WarehouseInventory } from '@/types/warehouse';
import debounce from 'lodash/debounce';
import { ActionAbles } from '@/components/Dropdown';
import { History, Minus, Pen, Plus, Search } from 'lucide-react';
import { useAdminVariants, useMedusa } from 'medusa-react';
import * as XLSX from 'xlsx';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import ModalAddVariant from '../components/modal-add-variant';
import ModalVariantInventory from '../components/modal-variant-inventory';
import { expandedColumns, productColumns } from './product-columns';
import ModalTransactionHistory from '../components/modal-transaction-history';
import { Text } from '@/components/Typography';
import { Pagination } from '@/components/Pagination';

type Props = {};

const DEFAULT_PAGE_SIZE = 20;
const SEARCH_FETCH_LIMIT = 200;

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

	const isSearching = !!searchValue.trim();

	const { variants, isLoading, count, refetch } = useAdminVariants({
		q: searchValue || undefined,
		limit: isSearching ? SEARCH_FETCH_LIMIT : DEFAULT_PAGE_SIZE,
		offset: isSearching ? 0 : offset,
		expand: 'product,inventories,inventories.item_unit,inventories.warehouse',
	});

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const normalizedSearch = useMemo(
		() => searchValue.trim().toLowerCase(),
		[searchValue]
	);

	const getLocationPriority = (location?: string | null): number => {
		if (!normalizedSearch) return 2;
		const lower = (location ?? '').toLowerCase();
		if (!lower.includes(normalizedSearch)) return 2;
		if (lower === normalizedSearch || lower.startsWith(normalizedSearch))
			return 0;
		return 1;
	};

	const sortInventoriesByLocationPriority = (
		inventories: WarehouseInventory[]
	): WarehouseInventory[] => {
		if (!inventories?.length || !normalizedSearch) return inventories ?? [];

		return [...inventories].sort((a, b) => {
			const priorityA = getLocationPriority(a.warehouse?.location);
			const priorityB = getLocationPriority(b.warehouse?.location);
			if (priorityA !== priorityB) return priorityA - priorityB;
			const locA = (a.warehouse?.location ?? '').toLowerCase();
			const locB = (b.warehouse?.location ?? '').toLowerCase();
			return locA.localeCompare(locB);
		});
	};

	const sortedVariants = useMemo(() => {
		if (!variants?.length || !normalizedSearch) return variants ?? [];

		const getLocPriority = (loc?: string | null) => {
			const lower = (loc ?? '').toLowerCase();
			if (!lower.includes(normalizedSearch)) return 2;
			if (lower === normalizedSearch || lower.startsWith(normalizedSearch))
				return 0;
			return 1;
		};

		const getVariantPriority = (v: any) => {
			const inventories = v.inventories as WarehouseInventory[] | undefined;
			if (!inventories?.length) return 2;
			return Math.min(
				...inventories.map((inv) => getLocPriority(inv.warehouse?.location))
			);
		};

		return [...variants].sort((a, b) => {
			return getVariantPriority(a) - getVariantPriority(b);
		});
	}, [variants, normalizedSearch]);

	const displayVariants = useMemo(() => {
		const list = sortedVariants ?? variants ?? [];
		if (isSearching && list.length > DEFAULT_PAGE_SIZE) {
			const start = (numPages - 1) * DEFAULT_PAGE_SIZE;
			return list.slice(start, start + DEFAULT_PAGE_SIZE);
		}
		return list;
	}, [sortedVariants, variants, isSearching, numPages]);

	const displayCount = isSearching
		? (sortedVariants ?? variants ?? []).length
		: (count ?? 0);

	useEffect(() => {
		if (displayVariants.length) {
			setExpandedKeys(displayVariants.map((item) => item.id) as string[]);
		}
	}, [displayVariants]);

	useEffect(() => {
		setOffset(0);
		setNumPages(1);
	}, [searchValue]);

	const handleChangePage = (page: number) => {
		setNumPages(page);
		if (!isSearching) {
			setOffset((page - 1) * DEFAULT_PAGE_SIZE);
		}
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

				return variant.inventories
					.map((inv: any) => ({
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

	const expandedRowRender = (record: ProductVariant) => {
		const inventories = (record as any).inventories as
			| WarehouseInventory[]
			| undefined;
		if (!inventories?.length) return null;

		const sortedInventories = sortInventoriesByLocationPriority(inventories);

		return (
			<Table
				columns={expandColumns as any}
				dataSource={sortedInventories}
				rowKey="id"
				pagination={false}
			/>
		);
	};

	return (
		<Flex vertical gap={12}>
			<Flex
				align="center"
				justify="flex-end"
				className="py-4 w-full flex-col gap-2 md:flex-row md:items-center md:justify-end"
			>
				<Input
					placeholder="Tìm kiếm vị trí hoặc sản phẩm..."
					name="search"
					prefix={<Search size={16} />}
					onChange={handleChangeDebounce}
					className="w-[300px] md:mr-2"
				/>
				<Flex className="w-full justify-between gap-2 md:w-auto md:justify-end">
					<Button
						type="default"
						className="flex-1 md:flex-none md:mr-2"
						onClick={handleExportExcel}
						loading={isExporting}
					>
						Xuất Excel
					</Button>
					<Button
						type="dashed"
						className="flex-1 md:flex-none"
						onClick={() => {
							setExpandedKeys((prev) =>
								prev.length
									? []
									: (displayVariants?.map((item) => item.id) as string[]) || []
							);
						}}
					>
						{expandedKeys.length ? 'Ẩn vị trí' : 'Hiển thị vị trí'}
					</Button>
				</Flex>
			</Flex>

			<div className="hidden md:block">
				<Table
					dataSource={displayVariants}
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
						displayCount > DEFAULT_PAGE_SIZE && {
							onChange: (page) => handleChangePage(page),
							pageSize: DEFAULT_PAGE_SIZE,
							current: numPages || 1,
							total: displayCount,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} trong ${total} sản phẩm`,
						}
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
										src={variantItem.product?.thumbnail ?? '/images/product-img.png'}
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
									actions={[
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
									] as any}
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
