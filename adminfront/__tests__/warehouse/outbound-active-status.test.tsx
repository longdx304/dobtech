import { expect } from '@jest/globals';
import { render } from '@testing-library/react';
import { useAdminProductOutbounds } from '@/lib/hooks/api/product-outbound';
import ListOutbound from '@/modules/admin/warehouse/outbound/templates/list-outbound';

jest.mock('@/components/Card', () => ({
	Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Flex', () => ({
	Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/Input', () => ({
	Input: () => <input />,
}));
jest.mock('@/components/List', () => () => <div />);
jest.mock('@/components/Switch', () => ({
	Switch: () => <button type="button" />,
}));
jest.mock('@/components/Tabs', () => ({
	Tabs: () => <div />,
}));
jest.mock('@/components/Typography', () => ({
	Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
	Title: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));
jest.mock('@/lib/hooks/api/product-outbound', () => ({
	useAdminProductOutboundHandler: () => ({ isLoading: false, mutateAsync: jest.fn() }),
	useAdminProductOutboundRemoveHandler: () => ({ mutateAsync: jest.fn() }),
	useAdminProductOutbounds: jest.fn(() => ({
		orders: [],
		isLoading: false,
		count: 0,
	})),
}));
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('lodash/debounce', () => (callback: unknown) => callback);

describe('ListOutbound', () => {
	it('requests partially fulfilled orders in the active outbound tab', () => {
		render(<ListOutbound />);

		expect(useAdminProductOutbounds).toHaveBeenCalledWith(
			expect.objectContaining({
				fulfillment_status: 'not_fulfilled,partially_fulfilled',
			})
		);
	});
});
