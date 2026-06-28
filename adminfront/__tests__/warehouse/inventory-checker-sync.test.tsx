import { expect } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import InventoryChecker from '@/modules/admin/warehouse/inventory-checker/templates/inventory';
import { useSyncInventory } from '@/lib/hooks/api/product/mutations';

const syncInventory = jest.fn();
const refetch = jest.fn();
let syncOptions: any;

jest.mock('@/components/Button', () => ({
	Button: ({
		children,
		disabled,
		onClick,
	}: {
		children: React.ReactNode;
		disabled?: boolean;
		onClick?: () => void;
	}) => (
		<button type="button" disabled={disabled} onClick={onClick}>
			{children}
		</button>
	),
}));
jest.mock('@/components/Card', () => ({
	Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Flex', () => ({
	Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Input', () => ({
	Input: () => <input />,
}));
jest.mock('@/components/Table', () => ({
	Table: ({ dataSource, rowSelection }: any) => (
		<div>
			<button
				type="button"
				onClick={() =>
					rowSelection?.onChange?.(['variant_1'], [dataSource?.[0]])
				}
			>
				select first mismatch
			</button>
		</div>
	),
}));
jest.mock('@/components/Typography', () => ({
	Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
	Title: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));
jest.mock('@/lib/hooks/api/product/mutations', () => ({
	useSyncInventory: jest.fn((options) => {
		syncOptions = options;
		return {
			mutate: syncInventory,
			isLoading: false,
		};
	}),
}));
jest.mock('@/lib/hooks/api/warehouse', () => ({
	useAdminWarehousesInventoryVariant: () => ({
		data: [
			{
				variant_id: 'variant_1',
				product_title: 'Product A',
				variant_title: 'Size 1',
				inventory_quantity: 0,
				total_quantity: 12,
			},
		],
		isLoading: false,
		refetch,
	}),
}));
jest.mock('@/lib/providers/user-provider', () => ({
	useUser: () => ({ user: { role: 'admin' } }),
}));
jest.mock('antd', () => ({
	message: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));
jest.mock('lodash/debounce', () => (callback: unknown) => callback);

const { message } = jest.requireMock('antd');

describe('InventoryChecker sync resolve queue', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		syncOptions = undefined;
	});

	it('syncs only selected mismatch variants', () => {
		render(<InventoryChecker />);

		fireEvent.click(screen.getByText('select first mismatch'));
		fireEvent.click(screen.getByText('Đồng bộ mục đã chọn'));

		expect(syncInventory).toHaveBeenCalledWith({
			variant_ids: ['variant_1'],
		});
	});

	it('notifies synced count and refetches after successful sync', () => {
		render(<InventoryChecker />);

		act(() => {
			syncOptions.onSuccess({ synced_count: 2 });
		});

		expect(message.success).toHaveBeenCalledWith('Đã đồng bộ 2 sản phẩm');
		expect(refetch).toHaveBeenCalled();
	});

	it('notifies when there are no mismatches after sync', () => {
		render(<InventoryChecker />);

		act(() => {
			syncOptions.onSuccess({ synced_count: 0 });
		});

		expect(message.success).toHaveBeenCalledWith(
			'Không còn sản phẩm lệch tồn'
		);
		expect(refetch).toHaveBeenCalled();
	});

	it('shows backend rollback message when sync fails', () => {
		render(<InventoryChecker />);

		syncOptions.onError({
			response: {
				data: {
					message: 'Đồng bộ tồn kho thất bại, dữ liệu đã được hoàn tác',
				},
			},
		});

		expect(message.error).toHaveBeenCalledWith(
			'Đồng bộ tồn kho thất bại, dữ liệu đã được hoàn tác'
		);
	});
});
