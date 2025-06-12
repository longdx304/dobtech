'use client';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { useAdminWarehouseManageKiotBySku } from '@/lib/hooks/api/warehouse';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { WarehouseKiotBySku, WarehouseKiotRecord } from '@/types/kiot';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import ModalAddVariant from '../components/modal-add-variant';
import ModalVariantInventory from '../components/modal-variant-inventory';
import { expandedColumns, productColumns } from './product-columns';
type Props = {};

const DEFAULT_PAGE_SIZE = 20;

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

	const [inventoryType, setInventoryType] = useState<string>('');
	const [variant, setVariant] = useState<WarehouseKiotBySku>();
	const [warehouseInventory, setWarehouseInventory] =
		useState<WarehouseKiotRecord>();
	const [searchValue, setSearchValue] = useState<string>('');
	const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
	const [sku, setSku] = useState<string>('');
	const [offset, setOffset] = useState<number>(0);
	const [numPages, setNumPages] = useState<number>(1);

	const { inventoryBySku, isLoading, refetch, count } =
		useAdminWarehouseManageKiotBySku({
			q: searchValue,
			offset,
			limit: DEFAULT_PAGE_SIZE,
		});

	useEffect(() => {
		if (inventoryBySku?.length) {
			const keys = inventoryBySku
				.map((item) => item.sku)
				.filter((item) => item);
			setExpandedKeys(keys as string[]);
		}
	}, [inventoryBySku]);

	const handleChangeDebounce = debounce((e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;
		setSearchValue(inputValue);
	}, 500);

	const handleEditWarehouse = (item: WarehouseKiotBySku) => {
		setQuantity(1);
		setVariant(item);

		openVariantInventory();
	};

	const columns = productColumns({
		handleEditWarehouse,
	});

	// Add variant inventory
	const handleAddInventory = (
		item: WarehouseKiotRecord,
		parentSku?: string
	) => {
		item && item.item_unit && setSelectedUnit(item.item_unit.id);
		setQuantity(1);
		setWarehouseInventory(item);
		if (parentSku) {
			setSku(parentSku);
		}
		setInventoryType('INBOUND');
		openInventory();
	};
	// Remove variant inventory
	const handleRemoveInventory = (
		item: WarehouseKiotRecord,
		parentSku?: string
	) => {
		item && item.item_unit && setSelectedUnit(item.item_unit.id);
		setQuantity(1);
		setWarehouseInventory(item);
		if (parentSku) {
			setSku(parentSku);
		}
		setInventoryType('OUTBOUND');
		openInventory();
	};

	// Close modal variant inventory
	const handleCloseModal = () => {
		closeInventory();
		setQuantity(1);
		setWarehouseInventory(undefined);
		setSku('');
	};

	const expandColumns = expandedColumns({
		handleAddInventory,
		handleRemoveInventory,
	});

	const handleChangePage = (page: number) => {
		setNumPages(page);
		setOffset((page - 1) * DEFAULT_PAGE_SIZE);
	};

	const expandedRowRender = (record: WarehouseKiotBySku) => {
		if (!record.records?.length) return null;

		const columnsWithSku = expandedColumns({
			handleAddInventory: (item: WarehouseKiotRecord) =>
				handleAddInventory(item, record.sku),
			handleRemoveInventory: (item: WarehouseKiotRecord) =>
				handleRemoveInventory(item, record.sku),
		});

		return (
			<Table
				columns={columnsWithSku as any}
				dataSource={record.records}
				rowKey="id"
				pagination={false}
			/>
		);
	};

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
					type="dashed"
					onClick={() => {
						setExpandedKeys((prev) =>
							prev.length
								? []
								: (inventoryBySku?.map((item: any) => item.sku) as string[]) ||
								  []
						);
					}}
				>
					{expandedKeys.length ? 'Ẩn vị trí' : 'Hiển thị vị trí'}
				</Button>
			</Flex>
			<Table
				dataSource={inventoryBySku}
				expandable={{
					expandedRowRender: expandedRowRender as any,
					expandedRowKeys: expandedKeys,
					onExpandedRowsChange: (keys) => {
						setExpandedKeys(keys as string[]);
					},
				}}
				loading={isLoading}
				rowKey="sku"
				columns={columns as any}
				pagination={
					(count ?? 0) > DEFAULT_PAGE_SIZE && {
						onChange: (page) => handleChangePage(page),
						pageSize: DEFAULT_PAGE_SIZE,
						current: numPages || 1,
						total: count,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} trong ${total} sản phẩm`,
					}
				}
			/>
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
					sku={sku}
					refetch={refetch}
				/>
			)}
		</Flex>
	);
};

export default ProductManage;
