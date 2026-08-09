import {
	DeliveryStaff,
	FulfullmentStatus,
} from '@/types/fulfillments';

export const getDeliveryStaffName = (
	user: Partial<DeliveryStaff> | null | undefined,
	fallback: string
): string => {
	const fullName = [user?.last_name, user?.first_name]
		.filter((value): value is string => typeof value === 'string' && !!value.trim())
		.join(' ')
		.trim();

	return fullName || user?.email || fallback;
};

export const getDeliveryStaffLabel = (user: DeliveryStaff): string => {
	const name = getDeliveryStaffName(user, user.email);
	return name === user.email ? user.email : `${name} (${user.email})`;
};

export const validateDeliveryAssignment = (
	shipperId: string | null | undefined,
	assistantId: string | null | undefined
): string | null => {
	if (!shipperId) return 'Vui lòng chọn người phụ trách giao';
	if (assistantId && assistantId === shipperId) {
		return 'Người phụ trách giao và người phụ xe không được trùng nhau';
	}
	return null;
};

export const canEditDeliveryAssignment = (
	status: FulfullmentStatus
): boolean => status === FulfullmentStatus.DELIVERING;
