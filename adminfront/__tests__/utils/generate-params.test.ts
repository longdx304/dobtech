import { expect } from '@jest/globals';
import generateParams from '@/utils/generate-params';

describe('generateParams', () => {
	it('serializes nested date comparison filters with bracket notation', () => {
		const params = generateParams({
			created_at: { gte: new Date('2026-08-09T00:00:00.000Z') },
			status: 'awaiting',
		});

		expect(params).toBe(
			'?created_at%5Bgte%5D=2026-08-09T00%3A00%3A00.000Z&status=awaiting'
		);
	});

	it('omits empty values and keeps false and zero', () => {
		expect(
			generateParams({ q: '', offset: 0, isMyOrder: false, optional: null })
		).toBe('?offset=0&isMyOrder=false');
	});
});
