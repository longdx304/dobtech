import { expect } from '@jest/globals';
import orderColumns from '@/modules/admin/orders/templates/orders/order-column';

describe('MISA export status in the order list', () => {
	const orderNumberColumn = orderColumns({})[0] as any;

	it('uses a green tag after an order has been exported at least once', () => {
		const tag = orderNumberColumn.render(123, {
			metadata: { misa_export_count: 1 },
		});

		expect(tag.props.color).toBe('success');
	});

	it('keeps the default gray tag before the first export', () => {
		const tag = orderNumberColumn.render(123, {
			metadata: { misa_export_count: 0 },
		});

		expect(tag.props.color).toBeUndefined();
	});
});
