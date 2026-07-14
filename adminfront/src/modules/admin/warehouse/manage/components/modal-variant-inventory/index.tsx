import { Modal } from '@/components/Modal';
import {
	useAdminAddInventoryToWarehouse,
	useAdminRemoveInventoryToWarehouse,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/admin/warehouse/components/variant-inventory-form';
import { WarehouseInventory } from '@/types/warehouse';
import { message, Spin } from 'antd';
import { FC } from 'react';

interface Props {
	isModalOpen: boolean;
	onClose: () => void;
	inventoryType: string;
	warehouseInventory: WarehouseInventory;
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

	const title = inventoryType === 'INBOUND' ? 'Nhập hàng' : 'Xuất hàng';
	const addInventoryToWarehouse = useAdminAddInventoryToWarehouse();
	const removeInventoryToWarehouse = useAdminRemoveInventoryToWarehouse();
	const isSubmitting =
		addInventoryToWarehouse.isLoading || removeInventoryToWarehouse.isLoading;

	const handleOkModal = async () => {
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}

		if (inventoryType === 'INBOUND') {
			// onAddUnit();
			const itemData = {
				warehouse_id: warehouseInventory.warehouse_id,
				variant_id: warehouseInventory.variant_id,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
				warehouse_inventory_id: warehouseInventory.id,
				type: 'INBOUND',
			};

			try {
				await addInventoryToWarehouse.mutateAsync(itemData);
				refetch();
				onReset();
				message.success(`Đã nhập hàng thành công`);
			} catch (error: any) {
				message.error(getErrorMessage(error));
				return;
			}
		} else {
			const itemData = {
				warehouse_id: warehouseInventory.warehouse_id,
				variant_id: warehouseInventory.variant_id,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
				warehouse_inventory_id: warehouseInventory.id,
				type: 'OUTBOUND',
			};

			try {
				await removeInventoryToWarehouse.mutateAsync(itemData);
				refetch();
				onReset();
				message.success(`Đã xuất hàng thành công`);
			} catch (error: any) {
				message.error(getErrorMessage(error));
				return;
			}
		}
		onClose();
	};

	return (
		<>
			<Spin fullscreen spinning={isSubmitting} tip="Đang xử lý tồn kho..." />
			<Modal
				open={isModalOpen}
				handleCancel={() => {
					if (!isSubmitting) {
						onClose();
					}
				}}
				handleOk={handleOkModal}
				title={title}
				isLoading={isSubmitting}
				maskClosable={!isSubmitting}
				closable={!isSubmitting}
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
		</>
	);
};

export default ModalVariantInventory;
