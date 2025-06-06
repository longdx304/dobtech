import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import {
	useAdminCreateWarehouseLocationKiot,
	useAdminCreateWarehouseVariantKiot,
	useAdminWarehouses,
	useAdminWarehousesKiot,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/admin/warehouse/components/variant-inventory-form';
import { WarehouseKiotBySku } from '@/types/kiot';
import { Warehouse } from '@/types/warehouse';
import { message } from 'antd';
import { debounce, isEmpty } from 'lodash';
import { LoaderCircle } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface Props {
	isModalOpen: boolean;
	onClose: () => void;
	variant: WarehouseKiotBySku;
	refetch?: () => void;
}
type ValueType = {
	key?: string;
	label: string;
	value: string;
};
const ModalAddVariant: FC<Props> = ({
	isModalOpen,
	onClose,
	variant,
	refetch = () => {},
}) => {
	const [searchValue, setSearchValue] = useState<string | undefined>();
	const [locationValue, setLocationValue] = useState<ValueType | undefined>();
	const [optionWarehouses, setOptionWarehouses] = useState<
		ValueType[] | undefined
	>();
	const { getSelectedUnitData, onReset } = useProductUnit();
	const unitData = getSelectedUnitData();
	const addWarehouseVariant = useAdminCreateWarehouseLocationKiot();

	const { warehouses, isLoading: warehouseLoading } = useAdminWarehousesKiot({
		q: searchValue || undefined,
	});

	// Debounce fetcher
	const debounceFetcher = debounce((value: string) => {
		setSearchValue(value);
	}, 800);

	useEffect(() => {
		if (warehouses) {
			const options = warehouses.map((warehouse: Warehouse) => ({
				label: warehouse.location,
				value: warehouse.id,
			}));
			setOptionWarehouses(options);
		}
		if (!warehouses?.length && searchValue) {
			setOptionWarehouses((prev) => {
				if (!prev) return [];
				return [...prev, { label: searchValue, value: searchValue }];
			});
		}
	}, [warehouses, searchValue]);

	const handleSelect = async (data: ValueType) => {
		const { label, value } = data as ValueType;
		if (!value || !label) return;

		setLocationValue({ label, value });
	};

	const handleOkModal = async () => {
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}
		if (!locationValue) {
			return message.error('Vui lòng chọn vị trí kho');
		}
		await addWarehouseVariant.mutateAsync(
			{
				location: locationValue.label,
				warehouse_id: locationValue?.value,
				sku: variant.sku,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
			},
			{
				onSuccess: () => {
					message.success(`Đã thêm sản phẩm vào kho thành công`);
					setSearchValue(undefined);
					setLocationValue(undefined);
					onReset();
					refetch();
				},
				onError: (error: any) => {
					message.error(getErrorMessage(error));
				},
			}
		);
		onClose();
	};

	return (
		<Modal
			open={isModalOpen}
			handleCancel={() => {
				onReset();
				setSearchValue(undefined);
				setLocationValue(undefined);
				onClose();
			}}
			handleOk={handleOkModal}
			title={`Thêm vị trí cho sản phẩm`}
			isLoading={addWarehouseVariant.isLoading}
		>
			<Flex vertical align="flex-start" className="w-full mb-2">
				<Text className="text-[14px] text-gray-500">Tên vị trí:</Text>
				<Select
					className="w-full"
					placeholder="Chọn vị trí"
					allowClear
					options={optionWarehouses}
					labelInValue
					filterOption={false}
					value={locationValue}
					onSearch={debounceFetcher}
					onSelect={handleSelect}
					showSearch
					notFoundContent={
						warehouseLoading ? (
							<LoaderCircle
								className="animate-spin w-full flex justify-center"
								size={18}
								strokeWidth={3}
							/>
						) : (
							'Không tìm thấy vị trí. Tiếp tục nhập để tạo vị trí mới'
						)
					}
				/>
			</Flex>
			<VariantInventoryForm type={'INBOUND'} />
		</Modal>
	);
};

export default ModalAddVariant;
