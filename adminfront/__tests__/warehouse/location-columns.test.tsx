import { render, screen } from '@testing-library/react';
import { expandedColumns } from '@/modules/admin/warehouse/manage/templates/location-columns';

jest.mock('@/components/Flex', () => ({
	Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Image', () => ({
	Image: ({ alt }: { alt: string }) => <img alt={alt} />,
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
jest.mock('@/components/Typography', () => ({
	Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe('warehouse location expandedColumns', () => {
	it('renders product cell when variant is missing', () => {
		const columns = expandedColumns({
			handleAddInventory: jest.fn(),
			handleRemoveInventory: jest.fn(),
		});
		const productColumn = columns[0];

		render(<>{productColumn.render(null as never)}</>);

		expect(screen.getByText('Sản phẩm không xác định')).toBeInTheDocument();
	});
});
