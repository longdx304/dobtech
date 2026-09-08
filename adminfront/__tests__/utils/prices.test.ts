/** @jest-environment node */

import { extractOptionPrice } from '@/utils/prices';

describe('extractOptionPrice', () => {
	it('does not divide zero-decimal VND shipping prices by 100', () => {
		expect(
			extractOptionPrice(30_000, {
				currency_code: 'vnd',
				tax_rate: 0,
			} as any)
		).toBe('30.000 VND');
	});

	it('normalizes currencies that have two decimal digits', () => {
		expect(
			extractOptionPrice(3_000, {
				currency_code: 'usd',
				tax_rate: 0,
			} as any)
		).toBe('30.00 USD');
	});
});
