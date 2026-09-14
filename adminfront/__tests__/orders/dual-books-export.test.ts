import { expect } from '@jest/globals';
import { allocateVnd, buildDualBookRows, DualBookSettings, InvoicePartForExport, InvoiceReconciliationForExport } from '@/modules/admin/orders/components/orders/export-excel/dual-books';
import * as XLSX from 'xlsx';

const order = {
	id: 'order_3510', display_id: 3510, created_at: '2026-09-01T00:00:00.000Z',
	currency_code: 'vnd', fulfillment_status: 'fulfilled', total: 99_500_000,
	email: 'customer@example.com', customer: { customer_code: 'CUS-001133', first_name: 'Tín', last_name: 'Chị' },
	items: [
		{ id: 'line_a', quantity: 10, subtotal: 50_000_000, discount_total: 0, tax_total: 0, unit_price: 5_000_000, title: 'Giày A', variant: { sku: 'A' } },
		{ id: 'line_b', quantity: 10, subtotal: 50_000_000, discount_total: 0, tax_total: 0, unit_price: 5_000_000, title: 'Giỏ B', variant: { sku: 'B' } },
	],
} as any;

const parts: InvoicePartForExport[] = [
	{ id: 'part_1', misa_customer_code: 'KH.MOT', profile_label: 'Công ty Một', consumer_name: null, consumer_address: null, invoice_date: null, is_issued: false,
		items: [{ line_item_id: 'line_a', quantity: 4 }, { line_item_id: 'line_b', quantity: 4 }] },
	{ id: 'part_2', misa_customer_code: 'KH.HAI', profile_label: 'Công ty Hai', consumer_name: null, consumer_address: null, invoice_date: null, is_issued: false,
		items: [{ line_item_id: 'line_a', quantity: 6 }, { line_item_id: 'line_b', quantity: 6 }] },
];

const reconciliation: InvoiceReconciliationForExport = {
	management: { subtotal: 100_000_000, discount_total: 1_000_000, tax_total: 0, shipping_total: 500_000, total: 99_500_000 },
	tax_parts: [
		{ part_id: 'part_1', misa_customer_code: 'KH.MOT', subtotal: 40_000_000, discount_total: 400_000, tax_total: 0, shipping_total: 200_000, total: 39_800_000,
			items: [
				{ line_item_id: 'line_a', quantity: 4, subtotal: 20_000_000, discount_total: 0, tax_total: 0 },
				{ line_item_id: 'line_b', quantity: 4, subtotal: 20_000_000, discount_total: 0, tax_total: 0 },
			] },
		{ part_id: 'part_2', misa_customer_code: 'KH.HAI', subtotal: 60_000_000, discount_total: 600_000, tax_total: 0, shipping_total: 300_000, total: 59_700_000,
			items: [
				{ line_item_id: 'line_a', quantity: 6, subtotal: 30_000_000, discount_total: 0, tax_total: 0 },
				{ line_item_id: 'line_b', quantity: 6, subtotal: 30_000_000, discount_total: 0, tax_total: 0 },
			] },
	],
	difference: { subtotal: 0, discount_total: 0, tax_total: 0, shipping_total: 0, total: 0 },
};

const settings: DualBookSettings = {
	postingDate: '2026-09-14',
	items: {
		line_a: { unit: 'Đôi', managementWarehouse: 'KHH-HCM', taxWarehouse: 'KHODEPNKTHAI', taxRate: 8 },
		line_b: { unit: 'Giỏ', managementWarehouse: 'KHH-HCM', taxWarehouse: 'KHH-HCM', taxRate: 8 },
	},
};

describe('QT/TH trial export', () => {
	it('puts rounding remainder on a positive-value line', () => {
		expect(allocateVnd(100, [1, 2, 0])).toEqual([33, 67, 0]);
	});

	it('splits quantities and reconciles gross VND, discount and shipping across both books', () => {
		const result = buildDualBookRows(order, parts, reconciliation, settings);
		expect(result.managementRows).toHaveLength(2);
		expect(result.taxRows).toHaveLength(4);
		expect(result.managementTotal).toBe(99_500_000);
		expect(result.taxTotal).toBe(99_500_000);
		expect(result.taxDocuments.map((document) => [document.customerCode, document.total, document.quantity])).toEqual([['KH.MOT', 39_800_000, 8], ['KH.HAI', 59_700_000, 12]]);
		expect(result.managementRows.every((row) => row['Hiển thị trên sổ'] === 1 && row['Mã khách hàng'] === 'CUS-001133')).toBe(true);
		expect(result.taxRows.map((row) => row['Mã khách hàng'])).toEqual(['KH.MOT', 'KH.MOT', 'KH.HAI', 'KH.HAI']);
		expect(result.taxRows.map((row) => row['Số chứng từ (*)'])).toEqual(['BH2609-3510-1/2', 'BH2609-3510-1/2', 'BH2609-3510-2/2', 'BH2609-3510-2/2']);
		expect(result.managementRows[0]['Số chứng từ (*)']).toBe('BH2609-3510/2');
		expect(result.taxRows.map((row) => row['Số phiếu xuất'])).toEqual(['XK2609-3510-1/2', 'XK2609-3510-1/2', 'XK2609-3510-2/2', 'XK2609-3510-2/2']);
		expect(result.taxRows.filter((row) => row['Mã hàng (*)'] === 'B').map((row) => row['ĐVT'])).toEqual(['Giỏ', 'Giỏ']);
		expect(result.taxRows.filter((row) => row['Mã hàng (*)'] === 'B').map((row) => row['Kho'])).toEqual(['KHH-HCM', 'KHH-HCM']);
		expect(result.taxRows.every((row) => Number(row['Thành tiền']) + Number(row['Tiền thuế GTGT']) > 0)).toBe(true);
		expect(result.taxRows.reduce((sum, row) => sum + Number(row['Thành tiền']), 0)).toBeLessThan(result.managementTotal);
		expect(result.managementRows[0]['Ngày chứng từ (*)']).toBeInstanceOf(Date);
		expect(result.taxRows[0]['Ngày hạch toán (*)']).toBeInstanceOf(Date);
		expect(Object.keys(result.taxRows[0])).toHaveLength(56);
		const sheet = XLSX.utils.json_to_sheet(result.taxRows, { cellDates: true });
		expect(sheet.H2.t).toBe('d');
		expect(sheet.I2.t).toBe('d');
		expect(sheet.A2.v).toBe(0);
		expect(sheet.Q2.v).toBe('KH.MOT');
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, sheet, 'Đơn hàng');
		const saved = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
		const reopened = XLSX.read(saved, { type: 'buffer', cellDates: true }).Sheets['Đơn hàng'];
		expect(reopened.H2.v).toBeInstanceOf(Date);
		expect(reopened.Q2.v).toBe('KH.MOT');
	});

	it('refuses an incomplete split and a nonzero difference', () => {
		expect(() => buildDualBookRows(order, [{ ...parts[0], items: [{ line_item_id: 'line_a', quantity: 3 }, ...parts[0].items.slice(1)] }, parts[1]], reconciliation, settings)).toThrow(/Số lượng/);
		expect(() => buildDualBookRows(order, parts, { ...reconciliation, difference: { ...reconciliation.difference, total: 1 } }, settings)).toThrow(/đối chiếu/);
	});

	it('requires consumer identity for NTD and a MISA SKU for every line', () => {
		const consumerParts = [{ ...parts[0], misa_customer_code: 'NTD' }, parts[1]];
		const consumerReconciliation = { ...reconciliation, tax_parts: [{ ...reconciliation.tax_parts[0], misa_customer_code: 'NTD' }, reconciliation.tax_parts[1]] };
		expect(() => buildDualBookRows(order, consumerParts, consumerReconciliation, settings)).toThrow(/NTD/);
		expect(() => buildDualBookRows({ ...order, items: [{ ...order.items[0], variant: { sku: '' } }, order.items[1]] }, parts, reconciliation, settings)).toThrow(/SKU/);
	});
});
