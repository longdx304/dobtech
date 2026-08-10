import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import { Fulfillment } from '@/types/fulfillments';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { validateDeliveryAssignment } from '../../utils/delivery-assignment';
import DeliveryStaffSelect from '../delivery-staff-select';

type DeliveryAssignmentModalProps = {
	open: boolean;
	fulfillment: Fulfillment;
	onClose: () => void;
	onConfirm: (
		shipperId: string,
		deliveryAssistantId: string | null
	) => Promise<void>;
	isLoading: boolean;
};

const DeliveryAssignmentModal = ({
	open,
	fulfillment,
	onClose,
	onConfirm,
	isLoading,
}: DeliveryAssignmentModalProps) => {
	const [shipperId, setShipperId] = useState<string>();
	const [deliveryAssistantId, setDeliveryAssistantId] = useState<string>();
	const customerName = [
		fulfillment.order?.customer?.last_name,
		fulfillment.order?.customer?.first_name,
	]
		.filter(Boolean)
		.join(' ') || 'Khách hàng không xác định';

	useEffect(() => {
		if (!open) return;
		setShipperId(fulfillment.shipped_id || undefined);
		setDeliveryAssistantId(fulfillment.delivery_assistant_id || undefined);
	}, [
		open,
		fulfillment.shipped_id,
		fulfillment.delivery_assistant_id,
	]);

	const handleConfirm = async () => {
		const validationError = validateDeliveryAssignment(
			shipperId,
			deliveryAssistantId
		);
		if (validationError) {
			message.error(validationError);
			return;
		}

		try {
			await onConfirm(shipperId!, deliveryAssistantId || null);
		} catch {
			// The parent mutation displays the API error and keeps the modal open.
		}
	};

	return (
		<Modal
			open={open}
			title="Chỉnh sửa phân công"
			handleCancel={onClose}
			handleOk={handleConfirm}
			isLoading={isLoading}
			maskClosable={!isLoading}
			closable={!isLoading}
			okText="Lưu phân công"
		>
			<div className="space-y-4 py-4">
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
					<Text className="text-sm font-semibold">
						Đơn #{fulfillment.order?.display_id ?? '-'} · {customerName}
					</Text>
				</div>
				<div>
					<Text className="mb-2 block text-sm font-medium">
						Người phụ trách giao <span className="text-red-500">*</span>
					</Text>
					<DeliveryStaffSelect
						value={shipperId}
						onChange={setShipperId}
						excludeId={deliveryAssistantId}
						placeholder="Chọn người phụ trách giao"
						disabled={isLoading}
					/>
				</div>
				<div>
					<Text className="mb-2 block text-sm font-medium">Người phụ xe</Text>
					<DeliveryStaffSelect
						value={deliveryAssistantId}
						onChange={setDeliveryAssistantId}
						excludeId={shipperId}
						placeholder="Chọn người phụ xe (không bắt buộc)"
						allowClear
						disabled={isLoading}
					/>
				</div>
			</div>
		</Modal>
	);
};

export default DeliveryAssignmentModal;
