import { describe, expect, it } from '@jest/globals';
import {
	formatInventoryQuantity,
	getInventoryMaxQuantity,
	getInventoryUnitIssue,
} from './inventory-display';

describe('warehouse inventory display helpers', () => {
	it('formats a valid converted inventory quantity', () => {
		const inventory = {
			quantity: 12,
			unit_id: 'unit_1',
			item_unit: { id: 'unit_1', unit: 'bịch', quantity: 6 },
		};

		expect(formatInventoryQuantity(inventory)).toBe('2 bịch (12 đôi)');
		expect(getInventoryMaxQuantity(inventory)).toBe(2);
		expect(getInventoryUnitIssue(inventory)).toBeNull();
	});

	it('falls back safely when the item-unit relation is missing', () => {
		const inventory = {
			quantity: 12,
			unit_id: null,
			item_unit: null,
		};

		expect(formatInventoryQuantity(inventory)).toBe(
			'12 đôi (thiếu đơn vị quy đổi)'
		);
		expect(getInventoryMaxQuantity(inventory)).toBeUndefined();
		expect(getInventoryUnitIssue(inventory)).toBe(
			'Bản ghi tồn kho đang thiếu đơn vị hàng'
		);
	});

	it('rejects a zero conversion quantity without dividing by zero', () => {
		const inventory = {
			quantity: 12,
			unit_id: 'unit_1',
			item_unit: { id: 'unit_1', unit: 'bịch', quantity: 0 },
		};

		expect(formatInventoryQuantity(inventory)).toBe(
			'12 đôi (thiếu đơn vị quy đổi)'
		);
		expect(getInventoryMaxQuantity(inventory)).toBeUndefined();
		expect(getInventoryUnitIssue(inventory)).toBe(
			'Đơn vị hàng có số lượng quy đổi không hợp lệ'
		);
	});

	it('does not throw for an invalid inventory record', () => {
		expect(formatInventoryQuantity(null)).toBe('Không xác định');
		expect(getInventoryMaxQuantity(undefined)).toBeUndefined();
		expect(getInventoryUnitIssue(null)).toBe(
			'Bản ghi tồn kho đang thiếu đơn vị hàng'
		);
	});

	it('falls back when the unit label has an unexpected runtime type', () => {
		const inventory = {
			quantity: 12,
			unit_id: 'unit_1',
			item_unit: { id: 'unit_1', unit: 32 as any, quantity: 6 },
		};

		expect(formatInventoryQuantity(inventory)).toBe('2 đơn vị (12 đôi)');
	});
});
