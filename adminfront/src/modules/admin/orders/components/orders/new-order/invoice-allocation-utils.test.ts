import { describe, expect, it } from '@jest/globals';
import { normalizeInvoiceParts, NewOrderInvoicePart } from './invoice-allocation-utils';

const part = (key: string, quantities: Record<string, number>): NewOrderInvoicePart => ({ key, profile_id: key, quantities });
const items = [{ variant_id: 'sku-a', quantity: 10 }, { variant_id: 'sku-b', quantity: 6 }];

describe('normalizeInvoiceParts', () => {
	it('gives the only tax customer the full order', () => {
		expect(normalizeInvoiceParts([part('one', {})], items)[0].quantities).toEqual({ 'sku-a': 10, 'sku-b': 6 });
	});

	it('calculates the second customer as total minus the first', () => {
		const result = normalizeInvoiceParts([part('one', { 'sku-a': 4, 'sku-b': 1 }), part('two', {})], items);
		expect(result.map((item) => item.quantities)).toEqual([
			{ 'sku-a': 4, 'sku-b': 1 },
			{ 'sku-a': 6, 'sku-b': 5 },
		]);
	});

	it('calculates the third customer as the remainder and prevents over-allocation', () => {
		const result = normalizeInvoiceParts([
			part('one', { 'sku-a': 7, 'sku-b': 2 }),
			part('two', { 'sku-a': 8, 'sku-b': 1 }),
			part('three', {}),
		], items);
		expect(result.map((item) => item.quantities)).toEqual([
			{ 'sku-a': 7, 'sku-b': 2 },
			{ 'sku-a': 3, 'sku-b': 1 },
			{ 'sku-a': 0, 'sku-b': 3 },
		]);
	});
});
