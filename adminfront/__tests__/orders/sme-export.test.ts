import { expect } from '@jest/globals';
import {
	generateSmeExcelData,
	SmeExcelRow,
} from '@/modules/admin/orders/components/orders/export-excel';

describe('SME order export', () => {
	it('writes the selected sales person name to column W', () => {
		const [file] = generateSmeExcelData([
			{
				order: {
					id: 'order_1',
					display_id: 1,
					created_at: new Date('2026-07-30T00:00:00.000Z'),
					email: 'customer@example.com',
					customer: {
						first_name: 'Hàng',
						last_name: 'Khách',
						customer_code: 'KH001',
					},
					sales_person: {
						first_name: 'An',
						last_name: 'Nguyễn',
						email: 'an@example.com',
					},
					items: [
						{
							quantity: 2,
							unit_price: 108000,
							title: 'Sản phẩm',
							description: 'Biến thể',
							variant: {
								sku: 'SKU-1',
							},
						},
					],
				} as any,
				soChungTu: 'BH2607-1',
				soPhieuXuat: 'XK2607-1',
				vatRate: 8,
			},
		]);

		const [row] = file.rows as SmeExcelRow[];

		expect(Object.keys(row)[22]).toBe('NV bán hàng');
		expect(row['NV bán hàng']).toBe('An Nguyễn');
	});
});
