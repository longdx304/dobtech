import { expect } from '@jest/globals';
import { mergePreparedMisaCodes } from '@/modules/admin/orders/hooks/use-order-export';

describe('MISA export preparation', () => {
	it('keeps expanded order data when applying the persisted MISA codes', () => {
		const items = [{ id: 'item_1', quantity: 2 }];
		const customer = { id: 'customer_1', customer_code: 'KH001' };
		const originalOrder = {
			id: 'order_1',
			items,
			customer,
			misa_document_number: null,
			misa_stock_out_number: null,
		} as any;
		const preparedOrder = {
			id: 'order_1',
			misa_document_number: 'BH2608-3475',
			misa_stock_out_number: 'XK2608-3475',
		} as any;

		const result = mergePreparedMisaCodes(originalOrder, preparedOrder);

		expect(result.items).toBe(items);
		expect(result.customer).toBe(customer);
		expect(result.misa_document_number).toBe('BH2608-3475');
		expect(result.misa_stock_out_number).toBe('XK2608-3475');
	});
});
