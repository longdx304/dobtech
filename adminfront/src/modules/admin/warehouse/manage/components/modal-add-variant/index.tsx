import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import {
	useAdminCreateWarehouseVariant,
	useAdminWarehouses,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/admin/warehouse/components/variant-inventory-form';
import { ProductVariant } from '@/types/products';
import { Warehouse } from '@/types/warehouse';
import { message } from 'antd';
import { debounce } from 'lodash';
import { LoaderCircle } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface Props {
	isModalOpen: boolean;
	onClose: () => void;
	variant: ProductVariant;
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
	const [selectedOption, setSelectedOption] = useState<ValueType | undefined>();
	const [optionWarehouses, setOptionWarehouses] = useState<
		ValueType[] | undefined
	>();
	const { getSelectedUnitData, onReset } = useProductUnit();
	const unitData = getSelectedUnitData();
	const addWarehouseVariant = useAdminCreateWarehouseVariant();

	const { warehouse, isLoading: warehouseLoading } = useAdminWarehouses({
		q: searchValue || undefined,
		limit: 300,
	});

	// Debounce fetcher
	const debounceFetcher = debounce((value: string) => {
		setSearchValue(value);
	}, 800);

	useEffect(() => {
		if (warehouse) {
			const q = (searchValue || '').toLowerCase();
			const sorted = [...warehouse].sort((a, b) => {
				const aLoc = a.location.toLowerCase();
				const bLoc = b.location.toLowerCase();
				const aExact = aLoc === q;
				const bExact = bLoc === q;
				if (aExact !== bExact) return aExact ? -1 : 1;
				const aStarts = aLoc.startsWith(q);
				const bStarts = bLoc.startsWith(q);
				if (aStarts !== bStarts) return aStarts ? -1 : 1;
				return aLoc.localeCompare(bLoc);
			});
			const options = sorted.map((w: Warehouse) => ({
				label: w.location,
				value: w.id,
			}));
			setOptionWarehouses(options);
		}
		if (!warehouse?.length && searchValue) {
			setOptionWarehouses((prev) => {
				if (!prev) return [];
				return [...prev, { label: searchValue, value: searchValue }];
			});
		}
	}, [warehouse, searchValue]);

	const handleSelect = async (data: ValueType) => {
		const { label, value } = data as ValueType;
		if (!value || !label) return;

		setSelectedOption(data);
	};

	const handleOkModal = async () => {
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}
		if (!selectedOption) {
			return message.error('Vui lòng chọn vị trí kho');
		}
		await addWarehouseVariant.mutateAsync(
			{
				location: selectedOption.label,
				variant_id: variant.id,
				quantity: unitData.quantity,
				unit_id: unitData.unitId,
				type: 'INBOUND',
			},
			{
				onSuccess: () => {
					message.success(`Đã thêm sản phẩm vào kho thành công`);
					setSearchValue(undefined);
					setSelectedOption(undefined);
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
				setSelectedOption(undefined);
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
					value={selectedOption}
					onSearch={debounceFetcher}
					onSelect={handleSelect}
					onClear={() => {
						setSelectedOption(undefined);
						setSearchValue(undefined);
					}}
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
