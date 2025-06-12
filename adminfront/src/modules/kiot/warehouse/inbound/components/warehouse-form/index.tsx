import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import { queryClient } from '@/lib/constants/query-client';
import { useUpdateItemOrderAdminKiot } from '@/lib/hooks/api/kiot';
import {
	ADMIN_PRODUCT_OUTBOUND_KIOT,
	ADMIN_PRODUCT_OUTBOUND_KIOT_ITEM_CODE,
} from '@/lib/hooks/api/product-outbound';
import {
	useAdminCreateWarehouseKiotInventory,
	useAdminWarehouseInventoryKiotBySku,
	useAdminWarehousesKiot,
} from '@/lib/hooks/api/warehouse';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/admin/warehouse/components/variant-inventory-form';
import { WarehouseKiot } from '@/types/kiot';
import { LineItemKiot } from '@/types/lineItem';
import { Col, message, Row } from 'antd';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { LoaderCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import WarehouseItem from './warehouse-item';

type WarehouseFormProps = {
	sku: string;
	lineItem: LineItemKiot;
	isPermission: boolean;
};

type ValueType = {
	key?: string;
	label: string;
	value: string;
};

const WarehouseForm = ({ sku, lineItem, isPermission }: WarehouseFormProps) => {
	// state
	const { getSelectedUnitData, onReset } = useProductUnit();
	const [searchValue, setSearchValue] = useState<ValueType | null>(null);
	const { state: isModalOpen, onOpen, onClose } = useToggleState(false);

	// fetch hook api
	const {
		inventories,
		isLoading: warehouseInventoryLoading,
		refetch: refetchInventory,
	} = useAdminWarehouseInventoryKiotBySku(sku);

	const {
		warehouses,
		isLoading: warehouseLoading,
		refetch: refetchWarehouse,
	} = useAdminWarehousesKiot({
		q: searchValue?.label ?? undefined,
	});

	const addWarehouseKiot = useAdminCreateWarehouseKiotInventory();
	const updateItemOrderAdminKiot = useUpdateItemOrderAdminKiot(
		lineItem?.order_id?.toString(),
		lineItem.id
	);

	const unitData = getSelectedUnitData();

	// Debounce fetcher
	const debounceFetcher = debounce((value: string) => {
		if (!value.trim()) {
			return;
		}
		setSearchValue({
			label: value,
			value: '',
		});
	}, 800);

	// Format options warehouse
	const optionWarehouses = useMemo(() => {
		if (!warehouses) return [];
		return warehouses.map((warehouse: WarehouseKiot) => ({
			label: warehouse.location,
			value: warehouse.id,
		}));
	}, [warehouses]);

	const handleAddLocation = () => {
		if (!searchValue) return;

		onOpen();
	};

	const handleSelect = async (data: ValueType) => {
		const { label, value } = data as ValueType;
		if (!value || !label) return;

		setSearchValue({
			label,
			value,
		});
		onOpen();
	};
	const handleOkModal = async () => {
		if (!searchValue) return;

		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}

		if (!lineItem?.product_code) {
			return message.error('Không tìm thấy mã SKU của sản phẩm');
		}

		if (!unitData.unitId) {
			return message.error('Vui lòng chọn đơn vị');
		}

		if (unitData.quantity <= 0) {
			return message.error('Số lượng phải lớn hơn 0');
		}

		const payload = {
			location: searchValue?.label,
			warehouse_id: searchValue?.value,
			unit_id: unitData.unitId,
			sku: lineItem.product_code,
			quantity: unitData.quantity,
		};

		// clear state to refetch warehouse
		setSearchValue({
			label: '',
			value: '',
		});

		await addWarehouseKiot.mutateAsync(payload, {
			onSuccess: () => {
				updateItemOrderAdminKiot.mutate(
					{
						warehouse_quantity: unitData.quantity,
					},
					{
						onSuccess: () => {
							message.success('Thêm vị trí cho sản phẩm thành công');
							refetchWarehouse();
							refetchInventory();
							queryClient.invalidateQueries([
								ADMIN_PRODUCT_OUTBOUND_KIOT_ITEM_CODE,
								'detail',
							]);
							queryClient.invalidateQueries([
								ADMIN_PRODUCT_OUTBOUND_KIOT,
								'detail',
							]);
							onReset();
							onClose();
						},
						onError: (error: any) => {
							message.error(getErrorMessage(error));
						},
					}
				);
			},
			onError: (error: any) => {
				message.error(getErrorMessage(error));
			},
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
				{inventories?.length === 0 && (
					<Text className="text-gray-500">
						Sản phẩm chưa có vị trí ở trong kho
					</Text>
				)}
				<Row gutter={[8, 8]}>
					{inventories?.map((item: any) => (
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
							autoClearSearchValue={false}
							filterOption={false}
							value={!isEmpty(searchValue) ? searchValue : undefined}
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
							disabled={isEmpty(searchValue?.label)}
						>
							Thêm
						</Button>
					</Flex>
					{/* modal */}
					<Modal
						open={isModalOpen}
						handleCancel={() => {
							onReset();
							onClose();
							setSearchValue({
								label: '',
								value: '',
							});
						}}
						handleOk={handleOkModal}
						title={`Thao tác tại vị trí ${searchValue?.label}`}
						isLoading={addWarehouseKiot.isLoading}
					>
						<VariantInventoryForm type="INBOUND" />
					</Modal>
				</Flex>
			)}
		</Card>
	);
};

export default WarehouseForm;
