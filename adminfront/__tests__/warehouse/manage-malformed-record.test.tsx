import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import {
	expandedColumns,
	productColumns,
} from '@/modules/admin/warehouse/manage/templates/product-columns';

jest.mock('@/components/Dropdown', () => ({
	ActionAbles: () => <div />,
}));
jest.mock('@/components/Flex', () => ({
	Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Image', () => ({
	Image: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));
jest.mock('@/components/Tooltip', () => ({
	Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/components/Typography', () => ({
	Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe('warehouse manage malformed API records', () => {
	it('renders a variant with missing or invalid display fields', () => {
		const columns = productColumns({
			handleEditWarehouse: jest.fn(),
			handleOpenTransactionHistory: jest.fn(),
		}) as any[];

		expect(() =>
			render(
				<>{columns[0].render({
					id: 'variant_32',
					title: { unexpected: true },
					product: { title: null, thumbnail: 32 },
				} as any)}</>
			)
		).not.toThrow();
		expect(screen.getByText(/Sản phẩm không xác định/)).toBeTruthy();
		expect(screen.getAllByText(/Biến thể không xác định/).length).toBeGreaterThan(0);
	});

	it('renders an inventory with missing relations instead of throwing', () => {
		const columns = expandedColumns({
			handleAddInventory: jest.fn(),
			handleRemoveInventory: jest.fn(),
		}) as any[];

		expect(() =>
			render(
				<>{columns[1].render(12, {
					id: 'inventory_32',
					quantity: 12,
					unit_id: null,
					item_unit: null,
					warehouse: null,
				} as any)}</>
			)
		).not.toThrow();
		expect(screen.getByText('12 đôi (thiếu đơn vị quy đổi)')).toBeTruthy();
	});
});
