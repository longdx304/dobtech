import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import OutboundItem from '@/modules/admin/warehouse/outbound/components/outbound-item';
import { FulfillmentStatus } from '@/types/fulfillments';

jest.mock('@/components/Button', () => ({
	Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));
jest.mock('@/components/Card', () => ({
	Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Dropdown', () => ({
	ActionAbles: () => <div />,
}));
jest.mock('@/components/Flex', () => ({
	Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Tag', () => ({
	Tag: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Typography', () => ({
	Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));
jest.mock('@/lib/providers/user-provider', () => ({
	useUser: () => ({ user: { id: 'user_1' } }),
}));

describe('OutboundItem', () => {
	it('shows a partially fulfilled order as in progress', () => {
		render(
			<OutboundItem
				item={{
					id: 'order_1',
					display_id: 1,
					created_at: new Date(),
					fulfillment_status: FulfillmentStatus.PARTIALLY_FULFILLED,
					handler_id: 'user_1',
				} as any}
				handleClickDetail={jest.fn()}
				handleConfirm={jest.fn()}
				handleRemoveHandler={jest.fn()}
			/>
		);

		expect(screen.getByText('Đang tiến hành')).toBeInTheDocument();
	});
});
