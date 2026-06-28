import { render, screen } from '@testing-library/react';
import EditCreated from '@/modules/admin/orders/components/orders/timeline/timeline-events/order-edit/created';

jest.mock('medusa-react', () => ({
	useAdminCancelOrderEdit: () => ({ mutateAsync: jest.fn() }),
	useAdminConfirmOrderEdit: () => ({ mutateAsync: jest.fn() }),
	useAdminDeleteOrderEdit: () => ({ mutateAsync: jest.fn() }),
	useAdminUser: () => ({ user: null }),
}));
jest.mock('antd', () => ({
	message: {
		success: jest.fn(),
		error: jest.fn(),
	},
	Popconfirm: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/components/Button', () => ({
	Button: ({
		children,
		onClick,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
	}) => (
		<button type="button" onClick={onClick}>
			{children}
		</button>
	),
}));
jest.mock('@/components/Flex', () => ({
	Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Tooltip', () => ({
	Tooltip: ({
		children,
		title,
	}: {
		children: React.ReactNode;
		title: React.ReactNode;
	}) => <span title={String(title)}>{children}</span>,
}));
jest.mock(
	'@/modules/admin/common/components/placeholder-image',
	() => function PlaceholderImage() {
		return <div>placeholder</div>;
	}
);
jest.mock(
	'@/modules/admin/orders/components/orders/timeline/timeline-events/event-container',
	() =>
		function EventContainer({ children }: { children: React.ReactNode }) {
			return <div>{children}</div>;
		}
);
jest.mock(
	'@/modules/admin/orders/components/orders/timeline/timeline-events/order-edit',
	() => ({
		ByLine: () => <span>by line</span>,
	})
);
jest.mock(
	'@/modules/admin/orders/components/orders/edit-order-modal/context',
	() => ({
		useOrderEdit: () => ({
			isModalVisible: false,
			showModal: jest.fn(),
			setActiveOrderEditId: jest.fn(),
		}),
	})
);

describe('EditCreated', () => {
	it('renders order edit item when line item variant is missing', () => {
		render(
			<EditCreated
				refetchOrder={jest.fn()}
				event={
					{
						first: false,
						time: '2026-06-28T00:00:00.000Z',
						currency_code: 'VND',
						taxRate: 0,
						edit: {
							id: 'edit_1',
							status: 'requested',
							created_by: 'user_1',
							internal_note: null,
							changes: [
								{
									id: 'change_1',
									type: 'item_add',
									line_item: {
										title: 'Áo test',
										quantity: 1,
										thumbnail: null,
										variant: null,
									},
								},
							],
						},
					} as never
				}
			/>
		);

		expect(screen.getByText('Áo test')).toBeInTheDocument();
	});
});
