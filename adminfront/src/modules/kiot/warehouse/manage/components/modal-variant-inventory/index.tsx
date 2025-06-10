import { Modal } from '@/components/Modal';
import {
	useAdminCreateWarehouseVariantKiot,
	useAdminDeleteWarehouseVariantKiot,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/admin/warehouse/components/variant-inventory-form';
import { WarehouseKiotInventory } from '@/types/kiot';
import { message } from 'antd';
import { FC } from 'react';

interface Props {
	isModalOpen: boolean;
	onClose: () => void;
	inventoryType: string;
	warehouseInventory: WarehouseKiotInventory;
	refetch?: () => void;
}

const ModalVariantInventory: FC<Props> = ({
	isModalOpen,
	onClose,
	inventoryType,
	warehouseInventory,
	refetch = () => {},
}) => {
	const { getSelectedUnitData, onReset } = useProductUnit();
	const unitData = getSelectedUnitData();

	const title =
		inventoryType === 'INBOUND'
			? `Nhập hàng vào kho ${warehouseInventory.warehouse?.location}`
			: `Xuất hàng từ kho ${warehouseInventory.warehouse?.location}`;
	const addInventoryToWarehouse = useAdminCreateWarehouseVariantKiot();
	const removeInventoryToWarehouse = useAdminDeleteWarehouseVariantKiot();

	const handleOkModal = async () => {
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}

		if (inventoryType === 'INBOUND') {
			// onAddUnit();
			const itemData = {
				warehouse_id: warehouseInventory.warehouse?.id || '',
				sku: warehouseInventory.sku,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
				warehouse_inventory_id: warehouseInventory.id,
				type: 'INBOUND' as const,
			};

			onReset();
			await addInventoryToWarehouse.mutateAsync(itemData, {
				onSuccess: () => {
					refetch();
					message.success(`Đã nhập hàng thành công`);
				},
				onError: (error: any) => {
					message.error(getErrorMessage(error));
				},
			});
		} else {
			const itemData = {
				warehouse_id: warehouseInventory.warehouse?.id || '',
				sku: warehouseInventory.sku,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
				warehouse_inventory_id: warehouseInventory.id,
				type: 'OUTBOUND' as const,
			};

			onReset();
			await removeInventoryToWarehouse.mutateAsync(itemData, {
				onSuccess: () => {
					refetch();
					message.success(`Đã xuất hàng thành công`);
				},
				onError: (error: any) => {
					message.error(getErrorMessage(error));
				},
			});
		}
		onClose();
	};

	return (
		<Modal
			open={isModalOpen}
			handleCancel={() => {
				onClose();
			}}
			handleOk={handleOkModal}
			title={title}
			isLoading={
				addInventoryToWarehouse.isLoading ||
				removeInventoryToWarehouse.isLoading
			}
		>
			<VariantInventoryForm
				type={inventoryType as 'INBOUND' | 'OUTBOUND'}
				maxQuantity={
					inventoryType === 'OUTBOUND'
						? warehouseInventory.quantity /
						  warehouseInventory.item_unit.quantity
						: undefined
				}
			/>
		</Modal>
	);
};

export default ModalVariantInventory;
