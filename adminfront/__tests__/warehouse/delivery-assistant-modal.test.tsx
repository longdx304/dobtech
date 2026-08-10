import { expect } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DeliveryAssistantModal from '@/modules/admin/warehouse/shipment/components/delivery-assistant-modal';
import DeliveryAssignmentModal from '@/modules/admin/warehouse/shipment/components/delivery-assignment-modal';
import {
	canEditDeliveryAssignment,
	canStartDelivery,
	validateDeliveryAssignment,
} from '@/modules/admin/warehouse/shipment/utils/delivery-assignment';
import { FulfullmentStatus } from '@/types/fulfillments';

jest.mock('@/components/Modal', () => ({
	Modal: ({
		open,
		children,
		handleCancel,
		handleOk,
	}: {
		open: boolean;
		children: React.ReactNode;
		handleCancel: () => void;
		handleOk: () => void;
	}) =>
		open ? (
			<div>
				{children}
				<button onClick={handleCancel}>Hủy</button>
				<button onClick={handleOk}>Xác nhận</button>
			</div>
		) : null,
}));
jest.mock('@/components/Typography', () => ({
	Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));
jest.mock('@/lib/providers/user-provider', () => ({
	useUser: () => ({ user: { id: 'usr_driver' } }),
}));
jest.mock(
	'@/modules/admin/warehouse/shipment/components/delivery-staff-select',
	() => ({
		__esModule: true,
		default: ({
			value,
			placeholder,
		}: {
			value?: string;
			placeholder: string;
		}) => <div>{`${placeholder}:${value ?? ''}`}</div>,
	})
);

describe('DeliveryAssistantModal', () => {
	it('closes without updating the fulfillment', () => {
		const onClose = jest.fn();
		const onConfirm = jest.fn();
		render(
			<DeliveryAssistantModal
				open
				fulfillment={{ id: 'ful_1', order: { display_id: 32 } } as any}
				onClose={onClose}
				onConfirm={onConfirm}
				isLoading={false}
			/>
		);

		fireEvent.click(screen.getByText('Hủy'));
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('allows confirming without an assistant', async () => {
		const onConfirm = jest.fn().mockResolvedValue(undefined);
		render(
			<DeliveryAssistantModal
				open
				fulfillment={{ id: 'ful_1', order: { display_id: 32 } } as any}
				onClose={jest.fn()}
				onConfirm={onConfirm}
				isLoading={false}
			/>
		);

		fireEvent.click(screen.getByText('Xác nhận'));
		await waitFor(() => expect(onConfirm).toHaveBeenCalledWith(null));
	});
});

describe('delivery assignment validation', () => {
	it('requires a shipper', () => {
		expect(validateDeliveryAssignment(null, null)).toBe(
			'Vui lòng chọn người phụ trách giao'
		);
	});

	it('rejects duplicate shipper and assistant', () => {
		expect(validateDeliveryAssignment('usr_1', 'usr_1')).toBe(
			'Người phụ trách giao và người phụ xe không được trùng nhau'
		);
	});

	it('only allows editing while delivering', () => {
		expect(canEditDeliveryAssignment(FulfullmentStatus.DELIVERING)).toBe(true);
		expect(canEditDeliveryAssignment(FulfullmentStatus.AWAITING)).toBe(false);
		expect(canEditDeliveryAssignment(FulfullmentStatus.SHIPPED)).toBe(false);
		expect(canEditDeliveryAssignment(FulfullmentStatus.CANCELED)).toBe(false);
	});

	it('only allows starting an unassigned awaiting shipment', () => {
		expect(canStartDelivery(FulfullmentStatus.AWAITING, null)).toBe(true);
		expect(canStartDelivery(FulfullmentStatus.AWAITING, 'usr_1')).toBe(false);
		expect(canStartDelivery(FulfullmentStatus.CANCELED, null)).toBe(false);
	});
});

describe('DeliveryAssignmentModal', () => {
	it('prefills the current shipper and assistant', () => {
		render(
			<DeliveryAssignmentModal
				open
				fulfillment={{
					id: 'ful_1',
					shipped_id: 'usr_driver',
					delivery_assistant_id: 'usr_assistant',
				} as any}
				onClose={jest.fn()}
				onConfirm={jest.fn()}
				isLoading={false}
			/>
		);

		expect(
			screen.getByText('Chọn người phụ trách giao:usr_driver')
		).toBeTruthy();
		expect(
			screen.getByText(
				'Chọn người phụ xe (không bắt buộc):usr_assistant'
			)
		).toBeTruthy();
	});
});
