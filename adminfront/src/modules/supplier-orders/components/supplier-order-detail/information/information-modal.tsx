import { Input } from '@/components/Input';
import DatePicker from '@/components/Input/DatePicker';
import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import { queryClient } from '@/lib/constants/query-client';
import {
	supplierOrdersKeys,
	useAdminUpdateSupplierOrder,
} from '@/lib/hooks/api/supplier-order';
import { SupplierOrder } from '@/types/supplier';
import dayjs from 'dayjs';
import React, { useState } from 'react';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	supplierOrder: SupplierOrder;
};
const InformationModal: React.FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	supplierOrder,
}) => {
	const updateSupplierOrder = useAdminUpdateSupplierOrder(
		supplierOrder?.id || ''
	);

	const [formData, setFormData] = useState({
		displayName: supplierOrder?.display_name || '',
		estimatedProductionTime: supplierOrder?.estimated_production_time
			? dayjs(supplierOrder.estimated_production_time).format('YYYY-MM-DD')
			: '',
		settlementTime: supplierOrder?.settlement_time
			? dayjs(supplierOrder.settlement_time).format('YYYY-MM-DD')
			: '',
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleUpdateSupplierOrder = async () => {
		try {
			await updateSupplierOrder.mutateAsync({
				display_name: formData.displayName,
				estimated_production_time: dayjs(
					formData.estimatedProductionTime
				).toISOString(),
				settlement_time: dayjs(formData.settlementTime).toISOString(),
			});

			queryClient.invalidateQueries([supplierOrdersKeys, 'detail']);
			handleOk();
		} catch (error) {
			console.error('Error updating supplier order:', error);
		}
	};

	return (
		<Modal
			title="Chỉnh sửa thông tin"
			open={state}
			loading={updateSupplierOrder.isLoading}
			handleOk={handleUpdateSupplierOrder}
			handleCancel={handleCancel}
		>
			<div className="flex flex-col gap-2">
				<Text className="font-medium">Đơn hàng:</Text>
				<Input
					placeholder='Nhập tên đơn hàng (VD: "No.ADDA123")'
					value={formData.displayName}
					onChange={(e) => handleInputChange('displayName', e.target.value)}
				/>

				<Text className="font-medium">Ngày hoàn thành dự kiến:</Text>
				<DatePicker
					format="DD-MM-YYYY"
					minDate={dayjs()}
					value={dayjs(formData.estimatedProductionTime)}
					placeholder="Chọn ngày hoàn thành dự kiến"
					onChange={(date) =>
						handleInputChange(
							'estimatedProductionTime',
							date?.format('YYYY-MM-DD') || ''
						)
					}
				/>

				<Text className="font-medium">Ngày thanh toán dự kiến:</Text>
				<DatePicker
					format="DD-MM-YYYY"
					minDate={dayjs()}
					value={dayjs(formData.settlementTime)}
					placeholder="Chọn ngày thanh toán dự kiến"
					onChange={(date) =>
						handleInputChange(
							'settlementTime',
							date?.format('YYYY-MM-DD') || ''
						)
					}
				/>
			</div>
		</Modal>
	);
};

export default InformationModal;
