import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Popconfirm } from '@/components/Popconfirm';
import { Text } from '@/components/Typography';
import { ADMIN_LINEITEM } from '@/lib/hooks/api/line-item';
import {
	ADMIN_PRODUCT_INBOUND,
	ADMIN_PRODUCT_INBOUND_KIOT,
	ADMIN_PRODUCT_INBOUND_KIOT_ITEM_CODE,
} from '@/lib/hooks/api/product-inbound';
import { ADMIN_PRODUCT_OUTBOUND_KIOT, ADMIN_PRODUCT_OUTBOUND_KIOT_ITEM_CODE } from '@/lib/hooks/api/product-outbound';
import {
	useAdminAddInventoryToWarehouseKiot,
	useAdminRemoveInventoryKiot,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/admin/warehouse/components/variant-inventory-form';
import { LineItem } from '@/types/lineItem';
import { OrderInWarehouseKiot } from '@/types/warehouse';
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { Minus, Plus } from 'lucide-react';

type UpdatedLineItem = LineItem & {
	supplier_order_id: string;
};
type WarehouseItemProps = {
	item: any;
	lineItem: any;
	refetchInventory: () => void;
	isPermission?: boolean;
};
const WarehouseItem = ({
	item,
	lineItem,
	refetchInventory,
	isPermission = false,
}: WarehouseItemProps) => {
	const { getSelectedUnitData, onReset, setSelectedUnit, setQuantity } =
		useProductUnit();

	const addInventoryToWarehouseKiot = useAdminAddInventoryToWarehouseKiot();
	const removeInventoryFromWarehouseKiot = useAdminRemoveInventoryKiot();

	const unitData = getSelectedUnitData();

	const queryClient = useQueryClient();

	const quantity =
		item?.quantity === 0
			? `0`
			: `${item?.quantity / item?.item_unit?.quantity} ${
					item?.item_unit?.unit
			  }`;

	const onAddUnit = async () => {
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}
		const warehouse_quantity = lineItem.warehouse_quantity ?? 0;
		if (unitData.totalQuantity > lineItem.quantity - warehouse_quantity) {
			return message.error(
				`Tổng số lượng nhập vào không được lớn hơn số lượng giao (${lineItem.quantity} đôi)`
			);
		}

		if (unitData) {
			const itemData: OrderInWarehouseKiot = {
				warehouse_id: item.warehouse_id,
				sku: item.sku,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
				line_item_id: lineItem.id,
				order_id: lineItem.supplier_order_id,
				warehouse_inventory_id: item.id,
				type: 'INBOUND',
			};

			onReset();
			await addInventoryToWarehouseKiot.mutateAsync(itemData, {
				onSuccess: () => {
					message.success(`Đã nhập hàng vào vị trí ${item.warehouse.location}`);
					refetchInventory();
					queryClient.invalidateQueries([
						ADMIN_PRODUCT_OUTBOUND_KIOT_ITEM_CODE,
						'detail',
					]);
					queryClient.invalidateQueries([
						ADMIN_PRODUCT_OUTBOUND_KIOT,
						'detail',
					]);
				},
				onError: (error: any) => {
					message.error(getErrorMessage(error));
				},
			});
		}
	};

	const onRemoveUnit = async () => {
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}

		if (unitData) {
			const itemData: OrderInWarehouseKiot = {
				warehouse_id: item.warehouse_id,
				sku: item.sku,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
				line_item_id: lineItem.id,
				order_id: lineItem.supplier_order_id,
				warehouse_inventory_id: item.id,
				type: 'INBOUND',
			};

			onReset();
			await removeInventoryFromWarehouseKiot.mutateAsync(itemData, {
				onSuccess: () => {
					message.success(`Đã xuất hàng tại vị trí ${item.warehouse.location}`);
					refetchInventory();
					queryClient.invalidateQueries([
						ADMIN_PRODUCT_OUTBOUND_KIOT_ITEM_CODE,
						'detail',
					]);
					queryClient.invalidateQueries([
						ADMIN_PRODUCT_OUTBOUND_KIOT,
						'detail',
					]);
				},
				onError: (error: any) => {
					message.error(getErrorMessage(error));
				},
			});
		}
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
					isLoading={removeInventoryFromWarehouseKiot.isLoading}
					cancelText="Huỷ"
					okText="Xác nhận"
					handleOk={onRemoveUnit}
					handleCancel={() => onReset()}
					icon={null}
				>
					<Button
						className="w-[24px] h-[24px] rounded-full"
						type="default"
						danger
						onClick={() => {
							item && item.item_unit && setSelectedUnit(item.item_unit.id);
							setQuantity(1);
						}}
						icon={<Minus size={16} />}
					/>
				</Popconfirm>
			)}
			<Text className="text-white">{`${quantity} (${item.warehouse.location})`}</Text>
			{isPermission && (
				<Popconfirm
					title={`Nhập hàng tại vị trí (${item.warehouse.location})`}
					description={<VariantInventoryForm type="INBOUND" />}
					isLoading={addInventoryToWarehouseKiot.isLoading}
					cancelText="Huỷ"
					okText="Xác nhận"
					handleOk={onAddUnit}
					handleCancel={() => onReset()}
					icon={null}
				>
					<Button
						className="w-[24px] h-[24px] rounded-full"
						color="primary"
						onClick={() => {
							item && item.item_unit && setSelectedUnit(item.item_unit.id);
							setQuantity(1);
						}}
						icon={<Plus size={16} />}
					/>
				</Popconfirm>
			)}
		</Flex>
	);
};

export default WarehouseItem;
