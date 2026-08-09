import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import { useEffect, useState } from 'react';
import DeliveryStaffSelect from '../delivery-staff-select';

type DeliveryAssistantModalProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: (deliveryAssistantId: string | null) => Promise<void>;
	isLoading: boolean;
};

const DeliveryAssistantModal = ({
	open,
	onClose,
	onConfirm,
	isLoading,
}: DeliveryAssistantModalProps) => {
	const { user } = useUser();
	const [deliveryAssistantId, setDeliveryAssistantId] = useState<string>();

	useEffect(() => {
		if (open) setDeliveryAssistantId(undefined);
	}, [open]);

	const handleConfirm = async () => {
		try {
			await onConfirm(deliveryAssistantId || null);
		} catch {
			// The parent mutation displays the API error and keeps the modal open.
		}
	};

	return (
		<Modal
			open={open}
			title="Chọn người phụ xe"
			handleCancel={onClose}
			handleOk={handleConfirm}
			isLoading={isLoading}
			maskClosable={!isLoading}
			closable={!isLoading}
		>
			<div className="py-4">
				<Text className="mb-2 block text-sm text-gray-600">
					Người phụ trách giao mặc định là tài khoản đang thao tác. Người phụ
					xe có thể để trống.
				</Text>
				<DeliveryStaffSelect
					value={deliveryAssistantId}
					onChange={setDeliveryAssistantId}
					excludeId={user?.id}
					placeholder="Chọn người phụ xe (không bắt buộc)"
					allowClear
					disabled={isLoading}
				/>
			</div>
		</Modal>
	);
};

export default DeliveryAssistantModal;
