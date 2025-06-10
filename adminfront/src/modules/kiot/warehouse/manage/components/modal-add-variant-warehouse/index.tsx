import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import {
	useAdminCreateWarehouseVariant,
	useAdminCreateWarehouseVariantKiot,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/admin/warehouse/components/variant-inventory-form';
import { WarehouseKiot } from '@/types/kiot';
import { PricedVariant } from '@medusajs/medusa/dist/types/pricing';
import { message } from 'antd';
import { debounce, isEmpty } from 'lodash';
import { LoaderCircle } from 'lucide-react';
import { useAdminVariants } from 'medusa-react';
import { FC, useMemo, useState } from 'react';

interface Props {
	isModalOpen: boolean;
	onClose: () => void;
	warehouse: WarehouseKiot;
}
type ValueType = {
	key?: string;
	label: string;
	value: string;
};
const ModalAddVariantWarehouse: FC<Props> = ({
	isModalOpen,
	onClose,
	warehouse,
}) => {
	const [variantValue, setVariantValue] = useState<string | undefined>();
	const { getSelectedUnitData, onReset } = useProductUnit();
	const unitData = getSelectedUnitData();
	const addInventoryToWarehouse = useAdminCreateWarehouseVariantKiot();

	const handleOkModal = async () => {
		if (!variantValue) {
			return message.error('Vui lòng nhập tên sản phẩm');
		}
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}

		await addInventoryToWarehouse.mutateAsync(
			{
				location: warehouse.location,
				sku: variantValue,
				warehouse_id: warehouse.id,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
				type: 'INBOUND' as const,
				warehouse_inventory_id: '',
			},
			{
				onSuccess: () => {
					message.success(`Đã thêm sản phẩm vào kho thành công`);
					setVariantValue(undefined);
					onReset();
				},
				onError: (error: any) => {
					message.error(getErrorMessage(error));
				},
			}
		);
		onClose();
	};

	// Debounce fetcher
	const debounceFetcher = debounce((value: string) => {
		setVariantValue(value);
	}, 800);

	return (
		<Modal
			open={isModalOpen}
			handleCancel={() => {
				onReset();
				setVariantValue(undefined);
				onClose();
			}}
			handleOk={handleOkModal}
			title={`Thêm sản phẩm vào ${warehouse.location}`}
			isLoading={addInventoryToWarehouse.isLoading}
		>
			<Flex vertical align="flex-start" className="w-full mb-2">
				<Text className="text-[14px] text-gray-500">
					Tên biến thể sản phẩm:
				</Text>
				<Input
					className="w-full"
					placeholder="Chọn biến thể sản phẩm"
					allowClear
					onChange={(e) => debounceFetcher(e.target.value)}
				/>
			</Flex>
			<VariantInventoryForm type={'INBOUND'} />
		</Modal>
	);
};

export default ModalAddVariantWarehouse;
