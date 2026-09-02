import { expect } from '@jest/globals';
import * as XLSX from 'xlsx';
import { readProductImportWorkbook } from '@/modules/admin/products/components/products-list/product-import-file';

describe('product CSV import encoding', () => {
	it('preserves Vietnamese text in a UTF-8 CSV without a BOM', () => {
		const csv = [
			'Product Title,Variant Title,Variant SKU,Option 1 Name,Option 1 Value',
			'Dép LUOFU E6224M,Đen-40,luo-E6224M-Đen-40,Màu Sắc,Đen',
		].join('\n');
		const workbook = readProductImportWorkbook(
			new Uint8Array(Buffer.from(csv, 'utf8'))
		);
		const rows = XLSX.utils.sheet_to_json<Record<string, string>>(
			workbook.Sheets[workbook.SheetNames[0]]
		);

		expect(rows[0]).toMatchObject({
			'Product Title': 'Dép LUOFU E6224M',
			'Variant Title': 'Đen-40',
			'Variant SKU': 'luo-E6224M-Đen-40',
			'Option 1 Name': 'Màu Sắc',
			'Option 1 Value': 'Đen',
		});
	});
});
