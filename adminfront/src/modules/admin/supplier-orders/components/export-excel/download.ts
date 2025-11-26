import { ExcelFile } from './index';
import * as XLSX from 'xlsx';

/**
 * Downloads Excel files for the given supplier order data
 * Note: Requires 'xlsx' library to be installed: yarn add xlsx
 */
export const downloadExcelFiles = async (excelFiles: ExcelFile[]) => {
	try {
		excelFiles.forEach((file) => {
			// Create a new workbook
			const workbook = XLSX.utils.book_new();
			
			// Convert rows to worksheet
			const worksheet = XLSX.utils.json_to_sheet(file.rows);
			
			// Add the worksheet to the workbook
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Đơn mua hàng');
			
			// Generate filename
			const filename = `SupplierOrder_${file.displayId}_${file.soChungTu || 'export'}.xlsx`;
			
			// Write and download the file
			XLSX.writeFile(workbook, filename);
		});
		
		return true;
	} catch (error) {
		console.error('Error generating Excel files:', error);
		console.error('Make sure xlsx library is installed: yarn add xlsx');
		return false;
	}
};

/**
 * Alternative: Download as CSV (doesn't require xlsx library)
 */
export const downloadCSVFiles = (excelFiles: ExcelFile[]) => {
	excelFiles.forEach((file) => {
		if (file.rows.length === 0) return;
		
		// Get headers from first row
		const headers = Object.keys(file.rows[0]);
		
		// Create CSV content
		const csvRows = [];
		
		// Add header row
		csvRows.push(headers.join('\t')); // Using tab as separator for better compatibility
		
		// Add data rows
		file.rows.forEach(row => {
			const values = headers.map(header => {
				const value = row[header as keyof typeof row];
				// Handle values that might contain commas or special characters
				return typeof value === 'string' && value.includes(',') 
					? `"${value}"` 
					: value;
			});
			csvRows.push(values.join('\t'));
		});
		
		// Create blob and download
		const csvContent = csvRows.join('\n');
		const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		
		const filename = `SupplierOrder_${file.displayId}_${file.soChungTu || 'export'}.csv`;
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	});
};

