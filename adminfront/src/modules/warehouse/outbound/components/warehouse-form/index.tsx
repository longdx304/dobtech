import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Popconfirm } from '@/components/Popconfirm';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import { ADMIN_LINEITEM } from '@/lib/hooks/api/line-item';
import { ADMIN_PRODUCT_OUTBOUND } from '@/lib/hooks/api/product-outbound';
import {
	useAdminCreateInboundInventory,
	useAdminCreateOutboundInventory,
	useAdminCreateWarehouseVariant,
	useAdminRemoveOutboundInventory,
	useAdminWarehouseInventoryByVariant,
	useAdminWarehouses,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/warehouse/components/variant-inventory-form';
import { LineItem } from '@/types/lineItem';
import {
	AdminPostCreateOutboundInventoryReq,
	AdminPostRemmoveOutboundInventoryReq,
	Warehouse,
	WarehouseInventory,
} from '@/types/warehouse';
import { useQueryClient } from '@tanstack/react-query';
import { Col, message, Row, Modal as AntdModal } from 'antd';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { LoaderCircle, Minus, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

type WarehouseFormProps = {
	variantId: string;
	lineItem: LineItem;
	isPermission: boolean;
};

type ValueType = {
	key?: string;
	label: string;
	value: string;
};

const WarehouseForm = ({
	variantId,
	lineItem,
	isPermission,
}: WarehouseFormProps) => {
	const { getSelectedUnitData, onReset } = useProductUnit();

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

	const handleAddLocation = async () => {
		if (!searchValue) return;
		const unitData = getSelectedUnitData();
		AntdModal.confirm({
			title: 'Thêm vị trí mới',
			content: <VariantInventoryForm type="INBOUND" />,
			onOk: async () => {
				await addWarehouse.mutateAsync(
					{
						location: searchValue,
						variant_id: variantId,
					},
					{
						onSuccess: () => {
							message.success('Thêm vị trí cho sản phẩm thành công');
							refetchWarehouse();
							refetchInventory();
						},
						onError: (error: any) => {
							message.error(getErrorMessage(error));
						},
					}
				);
			},
			cancelText: 'Huỷ',
			okText: 'Xác nhận',
			icon: null,
		});
	};

	const handleSelect = async (data: ValueType) => {
		setSelectedValue(null);
		const { label, value } = data as ValueType;
		if (!value || !label) return;
		const unitData = getSelectedUnitData();
		AntdModal.confirm({
			title: 'Thêm vị trí mới',
			content: <VariantInventoryForm type="INBOUND" />,
			onOk: async () => {
				await addWarehouse.mutateAsync(
					{
						warehouse_id: value,
						location: label,
						variant_id: variantId,
					},
					{
						onSuccess: () => {
							message.success('Thêm vị trí cho sản phẩm thành công');
							refetchWarehouse();
							refetchInventory();
						},
						onError: (error: any) => {
							message.error(getErrorMessage(error));
						},
					}
				);
			},
			cancelText: 'Huỷ',
			okText: 'Xác nhận',
			icon: null,
		});
	};

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
								isPermission={isPermission}
							/>
						</Col>
					))}
				</Row>
			</Flex>
			{isPermission && (
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
			)}
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
	isPermission: boolean;
};
const WarehouseItem = ({
	item,
	lineItem,
	refetchInventory,
	isPermission,
}: WarehouseItemProps) => {
	const { getSelectedUnitData, onReset, setSelectedUnit } = useProductUnit();
	const createOutboundInventory = useAdminCreateOutboundInventory();
	const removeOutboundInventory = useAdminRemoveOutboundInventory();
	const queryClient = useQueryClient();
	const quantity =
		item?.quantity === 0
			? `0`
			: `${item?.quantity / item?.item_unit?.quantity} ${
					item?.item_unit?.unit
			  }`;

	const onRemoveInventory = async () => {
		const unitData = getSelectedUnitData();
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}

		const itemData: AdminPostRemmoveOutboundInventoryReq = {
			variant_id: item.variant_id,
			quantity: unitData.quantity,
			unit_id: unitData.unitId,
			line_item_id: lineItem.id,
			order_id: lineItem?.order_id ?? '',
			warehouse_inventory_id: item.id,
			warehouse_id: item.warehouse_id,
			type: 'OUTBOUND',
		};

		onReset();
		await removeOutboundInventory.mutateAsync(itemData, {
			onSuccess: () => {
				message.success(`Đã lấy hàng tại vị trí ${item.warehouse.location}`);
				refetchInventory();
				queryClient.invalidateQueries([ADMIN_PRODUCT_OUTBOUND, 'detail']);
				queryClient.invalidateQueries([ADMIN_LINEITEM, 'detail']);
			},
			onError: (error: any) => {
				message.error(getErrorMessage(error));
			},
		});
	};

	const onAddInventory = async () => {
		const unitData = getSelectedUnitData();
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}
		const warehouse_quantity = lineItem.warehouse_quantity ?? 0;
		if (unitData.totalQuantity > warehouse_quantity) {
			return message.error(
				`Số lượng hàng nhập vào không được lớn hơn số lượng đã lấy (${warehouse_quantity} đôi) của đơn hàng`
			);
		}
		const itemData: AdminPostCreateOutboundInventoryReq = {
			warehouse_id: item.warehouse_id,
			variant_id: item.variant_id,
			quantity: unitData.quantity,
			unit_id: unitData.unitId,
			line_item_id: lineItem.id,
			order_id: lineItem.order_id ?? '',
			warehouse_inventory_id: item.id,
			type: 'OUTBOUND',
		};

		onReset();
		await createOutboundInventory.mutateAsync(itemData, {
			onSuccess: () => {
				message.success(`Đã nhập hàng vào vị trí ${item.warehouse.location}`);
				refetchInventory();
				queryClient.invalidateQueries([ADMIN_PRODUCT_OUTBOUND, 'detail']);
				queryClient.invalidateQueries([ADMIN_LINEITEM, 'detail']);
			},
			onError: (error: any) => {
				message.error(getErrorMessage(error));
			},
		});
	};

	return (
		<Flex
			align="center"
			gap="small"
			justify="space-between"
			className="border-solid border-[1px] border-gray-400 rounded-md py-2 bg-[#2F5CFF] hover:bg-[#3D74FF] cursor-pointer px-4"
		>
			{isPermission && (
				<Popconfirm
					title={`Lấy hàng tại vị trí (${item.warehouse.location})`}
					description={
						<VariantInventoryForm
							maxQuantity={item.quantity / item.item_unit.quantity}
							type="OUTBOUND"
						/>
					}
					isLoading={removeOutboundInventory.isLoading}
					cancelText="Huỷ"
					okText="Xác nhận"
					handleOk={onRemoveInventory}
					handleCancel={() => {}}
					onOpenChange={(e) => onReset()}
					icon={null}
				>
					<Button
						className="w-[24px] h-[24px] rounded-full"
						type="default"
						danger
						onClick={() => setSelectedUnit(item.item_unit.id)}
						icon={<Minus size={16} />}
					/>
				</Popconfirm>
			)}
			<Text className="text-white">{`${quantity} (${item.warehouse.location})`}</Text>
			{isPermission && (
				<Popconfirm
					title={`Nhập hàng tại vị trí (${item.warehouse.location})`}
					description={<VariantInventoryForm type="INBOUND" />}
					isLoading={createOutboundInventory.isLoading}
					cancelText="Huỷ"
					okText="Xác nhận"
					handleOk={onAddInventory}
					handleCancel={() => {}}
					onOpenChange={(e) => onReset()}
					icon={null}
				>
					<Button
						className="w-[24px] h-[24px] rounded-full"
						color="primary"
						// variant="outlined"
						type="default"
						onClick={() =>
							item && item.item_unit && setSelectedUnit(item.item_unit.id)
						}
						icon={<Plus size={16} />}
					/>
				</Popconfirm>
			)}
		</Flex>
	);
};
