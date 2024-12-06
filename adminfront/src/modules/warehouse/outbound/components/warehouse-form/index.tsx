import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import {
	useAdminCreateWarehouseVariant,
	useAdminWarehouseInventoryByVariant,
	useAdminWarehouses,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/warehouse/components/variant-inventory-form';
import { LineItem } from '@/types/lineItem';
import { Warehouse } from '@/types/warehouse';
import { Modal as AntdModal, Col, message, Row } from 'antd';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { LoaderCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import WarehouseItem from './warehouse-item';

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
