import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Popconfirm } from '@/components/Popconfirm';
import { Select } from '@/components/Select';
import { Text } from '@/components/Typography';
import { ADMIN_LINEITEM } from '@/lib/hooks/api/line-item';
import { ADMIN_PRODUCT_OUTBOUND } from '@/lib/hooks/api/product-outbound';
import {
	useAdminPickOutboundItem,
	useAdminSplitPickOutboundItem,
	useAdminUndoPickOutboundItem,
	useAdminWarehouses,
} from '@/lib/hooks/api/warehouse';
import { useProductUnit } from '@/lib/providers/product-unit-provider';
import { getErrorMessage } from '@/lib/utils';
import VariantInventoryForm from '@/modules/admin/warehouse/components/variant-inventory-form';
import { LineItem } from '@/types/lineItem';
import {
	AdminPostCreateOutboundInventoryReq,
	AdminPostRemmoveInventoryReq,
	AdminPostSplitPickOutboundInventoryReq,
	Warehouse,
	WarehouseInventory,
} from '@/types/warehouse';
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { LoaderCircle, Minus, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

type UpdatedLineItem = LineItem & {
	supplier_order_id: string;
};
type ValueType = {
	key?: string;
	label: string;
	value: string;
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
	const {
		getSelectedUnitData,
		onReset,
		setSelectedUnit,
		setQuantity,
		item_units,
		optionItemUnits,
		defaultUnit,
	} = useProductUnit();
	const pickOutboundItem = useAdminPickOutboundItem();
	const splitPickOutboundItem = useAdminSplitPickOutboundItem();
	const undoPickOutboundItem = useAdminUndoPickOutboundItem();
	const queryClient = useQueryClient();
	const [splitPick, setSplitPick] = useState<{
		itemData: AdminPostRemmoveInventoryReq;
		sourceQuantity: number;
		remainingQuantity: number;
		surplusQuantity: number;
	} | null>(null);
	const [surplusLocation, setSurplusLocation] = useState<ValueType | null>(null);
	const [surplusSearchValue, setSurplusSearchValue] = useState<
		string | undefined
	>();
	const [surplusUnitId, setSurplusUnitId] = useState<string | null>(null);

	const { warehouse, isLoading: warehouseLoading } = useAdminWarehouses(
		{
			q: surplusSearchValue || undefined,
			limit: 300,
		},
		{
			enabled: !!splitPick,
		}
	);

	const unitData = getSelectedUnitData();
	const activeSurplusUnitId = surplusUnitId || defaultUnit;
	const activeSurplusUnit = useMemo(
		() => item_units.find((unit) => unit.id === activeSurplusUnitId),
		[item_units, activeSurplusUnitId]
	);
	const surplusUnitQuantity =
		splitPick && activeSurplusUnit
			? splitPick.surplusQuantity / activeSurplusUnit.quantity
			: 0;
	const isValidSurplusUnit =
		!!activeSurplusUnit &&
		Number.isInteger(surplusUnitQuantity) &&
		surplusUnitQuantity > 0;
	const optionWarehouses = useMemo(() => {
		if (!warehouse) return [];
		return warehouse.map((warehouse: Warehouse) => ({
			label: warehouse.location,
			value: warehouse.id,
		}));
	}, [warehouse]);

	const debounceSurplusFetcher = debounce((value: string) => {
		if (!value.trim()) {
			setSurplusSearchValue(undefined);
			setSurplusLocation(null);
			return;
		}

		setSurplusSearchValue(value);
		setSurplusLocation({
			label: value,
			value: '',
		});
	}, 800);

	const handleSurplusLocationSelect = (data: ValueType) => {
		const { label, value } = data;
		if (!value || !label) return;

		setSurplusSearchValue(label);
		setSurplusLocation({
			label,
			value,
		});
	};

	const quantity =
		item?.quantity === 0
			? `0`
			: `${item?.quantity / item?.item_unit?.quantity} ${
					item?.item_unit?.unit
			  }`;

	const onRemoveInventory = async () => {
		if (!unitData) {
			return message.error('Vui lòng chọn loại hàng và số lượng');
		}

		const itemData: AdminPostRemmoveInventoryReq = {
			variant_id: item.variant_id,
			quantity: unitData.quantity,
			unit_id: unitData.unitId,
			line_item_id: lineItem.id,
			order_id: lineItem?.order_id ?? '',
			warehouse_inventory_id: item.id,
			warehouse_id: item.warehouse_id,
			type: 'OUTBOUND',
		};

		const pickedQuantity = lineItem.warehouse_quantity ?? 0;
		const remainingQuantity = lineItem.quantity - pickedQuantity;

		if (remainingQuantity <= 0) {
			return message.error('Đơn hàng đã lấy đủ số lượng');
		}

		if (unitData.totalQuantity > remainingQuantity) {
			setSplitPick({
				itemData,
				sourceQuantity: unitData.totalQuantity,
				remainingQuantity,
				surplusQuantity: unitData.totalQuantity - remainingQuantity,
			});
			setSurplusUnitId(defaultUnit);
			setSurplusLocation(null);
			setSurplusSearchValue(undefined);
			return;
		}

		onReset();
		await pickOutboundItem.mutateAsync(itemData, {
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

	const closeSplitPickModal = () => {
		setSplitPick(null);
		setSurplusLocation(null);
		setSurplusSearchValue(undefined);
		setSurplusUnitId(null);
	};

	const onConfirmSplitPick = async () => {
		if (!splitPick) return;

		if (!surplusLocation?.label?.trim()) {
			return message.error('Vui lòng chọn hoặc nhập vị trí trả phần dư');
		}

		if (!activeSurplusUnitId || !activeSurplusUnit) {
			return message.error('Vui lòng chọn loại hàng cho phần dư');
		}

		if (!isValidSurplusUnit) {
			return message.error(
				`Phần dư ${splitPick.surplusQuantity} đôi không chia hết cho ${activeSurplusUnit.unit}`
			);
		}

		const payload: AdminPostSplitPickOutboundInventoryReq = {
			...splitPick.itemData,
			surplus: {
				warehouse_id: surplusLocation.value || undefined,
				location: surplusLocation.label.trim(),
				unit_id: activeSurplusUnitId,
				quantity: surplusUnitQuantity,
			},
		};

		await splitPickOutboundItem.mutateAsync(payload, {
			onSuccess: () => {
				message.success(
					`Đã lấy ${splitPick.remainingQuantity} đôi cho đơn và trả phần dư ${surplusUnitQuantity} ${activeSurplusUnit.unit} vào ${surplusLocation.label.trim()}`
				);
				refetchInventory();
				queryClient.invalidateQueries([ADMIN_PRODUCT_OUTBOUND, 'detail']);
				queryClient.invalidateQueries([ADMIN_LINEITEM, 'detail']);
				onReset();
				closeSplitPickModal();
			},
			onError: (error: any) => {
				message.error(getErrorMessage(error));
			},
		});
	};

	const onAddInventory = async () => {
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
		await undoPickOutboundItem.mutateAsync(itemData, {
			onSuccess: () => {
				message.success(`Đã hoàn hàng về vị trí ${item.warehouse.location}`);
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
					isLoading={pickOutboundItem.isLoading}
					cancelText="Huỷ"
					okText="Xác nhận"
					handleOk={onRemoveInventory}
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
					title={`Hoàn hàng về vị trí (${item.warehouse.location})`}
					description={<VariantInventoryForm type="INBOUND" />}
					isLoading={undoPickOutboundItem.isLoading}
					cancelText="Huỷ"
					okText="Xác nhận"
					handleOk={onAddInventory}
					handleCancel={() => onReset()}
					icon={null}
				>
					<Button
						className="w-[24px] h-[24px] rounded-full"
						color="primary"
						// variant="outlined"
						type="default"
						onClick={() => {
							item && item.item_unit && setSelectedUnit(item.item_unit.id);
							setQuantity(1);
						}}
						icon={<Plus size={16} />}
					/>
				</Popconfirm>
			)}
			<Modal
				open={!!splitPick}
				title="Tách bao và trả phần dư"
				handleCancel={() => {
					onReset();
					closeSplitPickModal();
				}}
				handleOk={onConfirmSplitPick}
				isLoading={splitPickOutboundItem.isLoading}
				disabled={!isValidSurplusUnit || !surplusLocation?.label?.trim()}
			>
				<Flex vertical gap={10}>
					<Text>
						Lấy từ kho: <strong>{splitPick?.sourceQuantity ?? 0}</strong> đôi
					</Text>
					<Text>
						Cần cho đơn: <strong>{splitPick?.remainingQuantity ?? 0}</strong>{' '}
						đôi
					</Text>
					<Text>
						Phần dư trả kho:{' '}
						<strong>{splitPick?.surplusQuantity ?? 0}</strong> đôi
					</Text>
					<Flex vertical align="flex-start">
						<Text className="text-[14px] text-gray-500">
							Vị trí trả phần dư:
						</Text>
						<Select
							className="w-full"
							placeholder="Chọn vị trí hoặc nhập vị trí mới"
							allowClear
							options={optionWarehouses}
							labelInValue
							filterOption={false}
							value={!isEmpty(surplusLocation) ? surplusLocation : undefined}
							onSearch={debounceSurplusFetcher}
							onSelect={handleSurplusLocationSelect}
							onClear={() => {
								setSurplusLocation(null);
								setSurplusSearchValue(undefined);
							}}
							showSearch
							dropdownRender={(menu) => (
								<div>
									{menu}
									{!isEmpty(surplusLocation?.label) && (
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
					</Flex>
					<Flex vertical align="flex-start">
						<Text className="text-[14px] text-gray-500">
							Loại hàng phần dư:
						</Text>
						<Select
							className="w-full"
							options={optionItemUnits}
							value={activeSurplusUnitId}
							onChange={(value) => setSurplusUnitId(value)}
						/>
					</Flex>
					<Text className={isValidSurplusUnit ? '' : 'text-red-500'}>
						Số lượng phần dư:{' '}
						<strong>
							{isValidSurplusUnit
								? `${surplusUnitQuantity} ${activeSurplusUnit?.unit}`
								: 'Không chia hết theo loại hàng đã chọn'}
						</strong>
					</Text>
				</Flex>
			</Modal>
		</Flex>
	);
};

export default WarehouseItem;
