import * as XLSX from 'xlsx';

/**
 * Product CSV files downloaded from Google Sheets are UTF-8 without a BOM.
 * SheetJS otherwise treats an ArrayBuffer CSV as a legacy binary code page,
 * which turns Vietnamese text into mojibake (for example, "Dép" -> "DÃ©p").
 */
export function readProductImportWorkbook(data: Uint8Array): XLSX.WorkBook {
	return XLSX.read(data, {
		type: 'array',
		codepage: 65001,
	});
}
