import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import { Fulfillment } from '@/types/fulfillments';
import { Hash, UserRound, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDeliveryStaffName } from '../../utils/delivery-assignment';
import DeliveryStaffSelect from '../delivery-staff-select';

type DeliveryAssistantModalProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: (deliveryAssistantId: string | null) => Promise<void>;
	isLoading: boolean;
	fulfillment: Fulfillment;
};

const DeliveryAssistantModal = ({
	open,
	onClose,
	onConfirm,
	isLoading,
	fulfillment,
}: DeliveryAssistantModalProps) => {
	const { user } = useUser();
	const [deliveryAssistantId, setDeliveryAssistantId] = useState<string>();
	const order = fulfillment.order;
	const customerName = [order?.customer?.last_name, order?.customer?.first_name]
		.filter(Boolean)
		.join(' ') || 'Khách hàng không xác định';
	const currentShipperName = getDeliveryStaffName(
		user,
		'Tài khoản đang thao tác'
	);

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
			title="Phân công giao hàng"
			handleCancel={onClose}
			handleOk={handleConfirm}
			isLoading={isLoading}
			maskClosable={!isLoading}
			closable={!isLoading}
			okText="Bắt đầu giao"
		>
			<div className="space-y-4 py-4">
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
					<div className="flex items-center gap-2">
						<Hash size={16} className="shrink-0 text-gray-500" />
						<Text className="text-sm font-semibold">
							Đơn #{order?.display_id ?? '-'} · {customerName}
						</Text>
					</div>
				</div>
				<div>
					<Text className="mb-2 block text-sm font-medium">
						Người phụ trách giao
					</Text>
					<div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
						<UserRound size={18} className="shrink-0 text-gray-500" />
						<div className="min-w-0">
							<Text className="block truncate text-sm font-semibold">
								{currentShipperName}
							</Text>
							<Text className="block text-xs text-gray-500">
								Tài khoản đang thao tác
							</Text>
						</div>
					</div>
				</div>
				<div>
					<Text className="mb-2 flex items-center gap-2 text-sm font-medium">
						<UsersRound size={18} className="text-gray-500" />
						Người phụ xe <span className="font-normal text-gray-500">(tùy chọn)</span>
					</Text>
					<DeliveryStaffSelect
						value={deliveryAssistantId}
						onChange={setDeliveryAssistantId}
						excludeId={user?.id}
						placeholder="Chọn người phụ xe"
						allowClear
						disabled={isLoading}
					/>
				</div>
			</div>
		</Modal>
	);
};

export default DeliveryAssistantModal;
