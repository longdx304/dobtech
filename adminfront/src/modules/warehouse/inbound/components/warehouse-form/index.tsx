import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Popconfirm } from '@/components/Popconfirm';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import {
	useAdminCreateInboundInventory,
	useAdminCreateWarehouseVariant,
	useAdminWarehouseInventoryByVariant,
	useAdminWarehouses,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { Warehouse, WarehouseInventory } from '@/types/warehouse';
import { LineItem } from '@medusajs/medusa';
import { Col, message, Row } from 'antd';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { LoaderCircle, Minus, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import VariantInventoryForm from '../variant-inventory-form';

type WarehouseFormProps = {
	variantId: string;
	lineItem: LineItem;
};

type ValueType = {
	key?: string;
	label: string;
	value: string;
};

const WarehouseForm = ({ variantId, lineItem }: WarehouseFormProps) => {
	const [searchValue, setSearchValue] = useState<string | null>(null);
	const {
		warehouse,
		isLoading: warehouseLoading,
		refetch: refetchWarehouse,
	} = useAdminWarehouses({
		q: searchValue,
	});

	const [selectedValue, setSelectedValue] = useState<string | null>(null);
	const addWarehouse = useAdminCreateWarehouseVariant();
	const {
		warehouseInventory,
		isLoading: warehouseInventoryLoading,
		refetch: refetchInventory,
	} = useAdminWarehouseInventoryByVariant(variantId);

	// Debounce fetcher
	const debounceFetcher = debounce((value: string) => {
		setSearchValue(value);
	}, 800);

	// Format options warehouse
	const optionWarehouses = useMemo(() => {
		if (!warehouse) return [];
		return warehouse.map((warehouse: Warehouse) => ({
			label: warehouse.location,
			value: warehouse.id,
		}));
	}, [warehouse]);

	const options: ValueType | [] = useMemo(() => {
		return [];
	}, []);

	const handleAddLocation = async () => {
		if (!searchValue) return;
		await addWarehouse.mutateAsync({
			location: searchValue,
			variant_id: variantId,
		});
		refetchWarehouse();
		refetchInventory();
	};

	const handleSelect = async (data: ValueType) => {
		try {
			setSelectedValue(null);
			const { label, value } = data as ValueType;
			if (!value || !label) return;
			await addWarehouse.mutateAsync({
				warehouse_id: value,
				location: label,
				variant_id: variantId,
			});
			refetchWarehouse();
			refetchInventory();
			message.success('Thêm vị trí cho sản phẩm thành công');
		} catch (error: any) {
			console.log('error:', error);
			message.error(error.error);
		}
	};

	console.log('warehouseInventory');
	return (
		<Card
			className="mt-2 shadow-none border-[1px] border-solid border-gray-300 rounded-[6px]"
			rounded
			loading={warehouseInventoryLoading}
		>
			<Flex vertical gap={6}>
				<Text strong className="">
					Vị trí sản phẩm trong kho
				</Text>
				{warehouseInventory?.length === 0 && (
					<Text className="text-gray-500">
						Sản phẩm chưa có vị trí ở trong kho
					</Text>
				)}
				<Row gutter={[8, 8]}>
					{warehouseInventory?.map((item: any) => (
						<Col xs={24} sm={12} key={item.id}>
							<WarehouseItem
								item={item}
								lineItem={lineItem as any}
								refetchInventory={refetchInventory}
							/>
						</Col>
					))}
				</Row>
			</Flex>
			<Flex vertical gap={6} className="mt-2">
				<Text strong className="">
					Tìm & thêm vị trí mới
				</Text>
				<Flex gap={4}>
					<Select
						className="flex-grow"
						placeholder="Chọn vị trí"
						allowClear
						options={optionWarehouses}
						labelInValue
						filterOption={false}
						value={
							selectedValue
								? { label: selectedValue, value: selectedValue }
								: null
						}
						onSearch={debounceFetcher}
						onSelect={handleSelect}
						showSearch
						dropdownRender={(menu) => (
							<div>
								{menu}
								{!isEmpty(searchValue) && (
									<div className="flex items-center justify-start p-2">
										<Text className="text-gray-300 cursor-pointer">
											Chọn thêm để tạo vị trí mới
										</Text>
									</div>
								)}
							</div>
						)}
						notFoundContent={
							warehouseLoading ? (
								<LoaderCircle
									className="animate-spin w-full flex justify-center"
									size={18}
									strokeWidth={3}
								/>
							) : (
								'Không tìm thấy vị trí'
							)
						}
					/>
					<Button
						className="w-fit h-[10]"
						onClick={handleAddLocation}
						disabled={isEmpty(searchValue)}
					>
						Thêm
					</Button>
				</Flex>
			</Flex>
		</Card>
	);
};

export default WarehouseForm;

type UpdatedLineItem = LineItem & {
	supplier_order_id: string;
};
type WarehouseItemProps = {
	item: WarehouseInventory;
	lineItem: UpdatedLineItem;
	refetchInventory: () => void;
};
const WarehouseItem = ({
	item,
	lineItem,
	refetchInventory,
}: WarehouseItemProps) => {
	const { getSelectedUnitData } = useProductUnit();
	const createInboundInventory = useAdminCreateInboundInventory();

	console.log('item', item);
	const quantity =
		item?.quantity === 0
			? `0 đôi`
			: `${item?.quantity / item?.item_unit?.quantity} ${
					item?.item_unit?.unit
			  }`;

	const onAddUnit = async () => {
		const unitData = getSelectedUnitData();
		if (unitData) {
			const itemData = {
				warehouse_id: item.warehouse_id,
				variant_id: item.variant_id,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
				line_item_id: lineItem.id,
				supplier_order_id: lineItem.supplier_order_id,
				warehouse_inventory_id: item.id,
				type: 'INBOUND',
			};

			refetchInventory();
			console.log('lineItem', lineItem);

			try {
				await createInboundInventory.mutateAsync(itemData);
				message.success('Thêm hàng tại vị trí thành công');
			} catch (error: any) {
				console.log('error:', error);
				message.error(error.error);
			}
		}
	};

	return (
		<Flex
			align="center"
			gap="small"
			justify="center"
			className="border-solid border-[1px] border-gray-400 rounded-md py-2 bg-[#2F5CFF] hover:bg-[#3D74FF] cursor-pointer"
		>
			<Popconfirm
				title={`Lấy hàng tại vị trí (${item.warehouse.location})`}
				description={<VariantInventoryForm type="OUTBOUND" />}
				// isLoading={isLoading}
				cancelText="Huỷ"
				okText="Xác nhận"
				handleOk={() => console.log('okText')}
				handleCancel={() => console.log('cancel')}
				icon={null}
			>
				<Button
					className="w-[24px] h-[24px] rounded-full"
					type="default"
					danger
					icon={<Minus size={16} />}
				/>
			</Popconfirm>
			<Text className="text-white">{`${quantity} (${item.warehouse.location})`}</Text>
			<Popconfirm
				title={`Nhập hàng tại vị trí (${item.warehouse.location})`}
				description={<VariantInventoryForm type="INBOUND" />}
				// isLoading={isLoading}
				cancelText="Huỷ"
				okText="Xác nhận"
				handleOk={onAddUnit}
				handleCancel={() => console.log('cancel')}
				icon={null}
			>
				<Button
					className="w-[24px] h-[24px] rounded-full"
					color="primary"
					// variant="outlined"
					type="default"
					icon={<Plus size={16} />}
				/>
			</Popconfirm>
		</Flex>
	);
};
