import { Order } from '@/types/order';
import dayjs from 'dayjs';
import { ICustomerResponse } from '@/types/customer';
import { generateSmeExcelData, SmeExcelRow } from './index';

export type InvoicePartForExport = {
	id: string;
	misa_customer_code: string;
	profile_label: string;
	consumer_name: string | null;
	consumer_address: string | null;
	invoice_date: string | null;
	is_issued: boolean;
	items: Array<{ line_item_id: string; quantity: number }>;
};

type MoneyTotals = { subtotal: number; discount_total: number; tax_total: number; shipping_total: number; total: number };
export type InvoiceReconciliationForExport = {
	management: MoneyTotals;
	tax_parts: Array<MoneyTotals & {
		part_id: string;
		misa_customer_code: string;
		items: Array<{ line_item_id: string; quantity: number; subtotal: number; discount_total: number; tax_total: number }>;
	}>;
	difference: MoneyTotals;
};

export type ItemMisaSettings = {
	unit: string;
	managementWarehouse: string;
	taxWarehouse: string;
	taxRate: number;
};

export type DualBookSettings = {
	postingDate: string;
	items: Record<string, ItemMisaSettings>;
};

export type DualBookResult = {
	managementRows: SmeExcelRow[];
	taxRows: SmeExcelRow[];
	managementTotal: number;
	taxTotal: number;
	documentNumbers: string[];
	taxDocuments: Array<{ number: string; customerCode: string; total: number; quantity: number }>;
	assumptions: string[];
};

const fail = (message: string): never => { throw new Error(message); };
const isVnd = (value: number) => Number.isSafeInteger(value) && value >= 0;
const excelDate = (value: string) => {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
};
const invoiceNumber = (base: string, partIndex: number, count: number, management: boolean) => {
	const number = management ? `${base}/${count}` : `${base}-${partIndex + 1}/${count}`;
	if (number.length > 20) fail(`Số chứng từ ${number} vượt 20 ký tự; hãy kiểm tra lại mã BH/XK của đơn`);
	return number;
};

/** Allocate VND by positive line values, leaving any rounding remainder on the last line. */
export function allocateVnd(amount: number, weights: number[]): number[] {
	if (!isVnd(amount) || weights.length === 0 || weights.some((weight) => !isVnd(weight))) fail('Tiền hoặc tỷ trọng phân bổ không hợp lệ');
	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
	if (!isVnd(totalWeight) || totalWeight === 0) fail('Không thể chia khoản tiền cho mặt hàng có giá trị bằng 0');
	const lastPositiveIndex = weights.reduce((last, weight, index) => weight > 0 ? index : last, -1);
	let allocated = 0;
	return weights.map((weight, index) => {
		const value = index === lastPositiveIndex ? amount - allocated : Math.floor(amount * weight / totalWeight);
		allocated += value;
		return value;
	});
}

const totalFromRows = (rows: SmeExcelRow[]) => rows.reduce((sum, row) =>
	sum + Number(row['Thành tiền']) - Number(row['Tiền chiết khấu'] || 0) + Number(row['Tiền thuế GTGT'] || 0), 0);

export function buildDualBookRows(
	order: Order,
	parts: InvoicePartForExport[],
	reconciliation: InvoiceReconciliationForExport,
	settings: DualBookSettings
): DualBookResult {
	if (order.currency_code?.toLowerCase() !== 'vnd') fail('Chỉ hỗ trợ đơn VND');
	if (!['fulfilled', 'shipped'].includes(order.fulfillment_status)) fail('Chỉ xuất đơn đã hoàn thành kho hoặc giao hàng');
	if (!/^\d{4}-\d{2}-\d{2}$/.test(settings.postingDate) || dayjs(settings.postingDate).format('YYYY-MM-DD') !== settings.postingDate) fail('Chọn ngày chứng từ hợp lệ');
	const managementCode = String((order.customer as ICustomerResponse | undefined)?.customer_code ?? '').trim();
	if (!managementCode) fail('Khách quản trị chưa có mã khách hàng');
	if (!parts.length || parts.length !== reconciliation.tax_parts.length) fail('Cần lưu đầy đủ phân bổ hóa đơn trước khi xuất');
	if (Object.values(reconciliation.difference).some((amount) => amount !== 0)) fail('Phân bổ tiền chưa đối chiếu về 0');
	if (!isVnd(order.total) || reconciliation.management.total !== order.total) fail('Tổng đơn đã thay đổi; hãy tải lại trang và đối chiếu');
	const orderItems = order.items ?? [];
	if (!orderItems.length) fail('Đơn không có mặt hàng');
	if (orderItems.some((item) => !item.variant?.sku?.trim())) fail('Mỗi mặt hàng cần mã SKU trên MISA trước khi xuất');
	const sortedItems = [...orderItems].sort((a, b) => String(a.variant?.sku ?? '').localeCompare(String(b.variant?.sku ?? '')));
	const baseBh = order.misa_document_number?.trim() || `BH${dayjs(order.created_at).format('YYMM')}-${order.display_id}`;
	const baseXk = order.misa_stock_out_number?.trim() || `XK${dayjs(order.created_at).format('YYMM')}-${order.display_id}`;
	if (!/^BH[0-9]{4}-[0-9]+$/i.test(baseBh) || !/^XK[0-9]{4}-[0-9]+$/i.test(baseXk)) fail('Mã chứng từ hiện tại không theo dạng BHYYMM-số đơn / XKYYMM-số đơn');
	const baseline = generateSmeExcelData([{ order, soChungTu: baseBh, soPhieuXuat: baseXk, vatRate: 8 }])[0];
	const baselineById = new Map(sortedItems.map((item, index) => [item.id, baseline.rows[index] as SmeExcelRow]));
	const quantityByLine = new Map(orderItems.map((item) => [item.id, 0]));
	const grossByLine = new Map(orderItems.map((item) => [item.id, 0]));
	const taxRows: SmeExcelRow[] = [];
	const date = excelDate(settings.postingDate);
	const documentNumbers: string[] = [];
	const taxDocuments: DualBookResult['taxDocuments'] = [];

	parts.forEach((part, partIndex) => {
		const allocated = reconciliation.tax_parts.find((entry) => entry.part_id === part.id);
		if (!allocated || allocated.misa_customer_code !== part.misa_customer_code || !String(part.misa_customer_code).trim()) return fail(`Phần hóa đơn ${partIndex + 1} chưa có mã khách thuế hợp lệ`);
		if (part.misa_customer_code === 'NTD' && (!part.consumer_name?.trim() || !part.consumer_address?.trim())) fail('Phần NTD cần tên và địa chỉ người tiêu dùng');
		const partItemById = new Map(part.items.map((item) => [item.line_item_id, item]));
		const rows = sortedItems.flatMap((item) => {
			const partItem = partItemById.get(item.id);
			if (!partItem) return [];
			const amount = allocated.items.find((entry) => entry.line_item_id === item.id);
			if (!amount || amount.quantity !== partItem.quantity || !Number.isSafeInteger(partItem.quantity) || partItem.quantity <= 0) return fail(`Số lượng ${item.variant?.sku ?? item.id} không khớp đối chiếu`);
			return [{ item, amount }];
		});
		if (!rows.length || rows.length !== part.items.length || rows.length !== allocated.items.length) fail(`Phần hóa đơn ${partIndex + 1} có mặt hàng không khớp đơn`);
		const lineDiscount = rows.reduce((sum, row) => sum + row.amount.discount_total, 0);
		const lineTax = rows.reduce((sum, row) => sum + row.amount.tax_total, 0);
		const extraDiscount = allocated.discount_total - lineDiscount;
		const extraTax = allocated.tax_total - lineTax;
		if (![extraDiscount, extraTax, allocated.shipping_total].every(isVnd)) fail('Khoản phí/chiết khấu/VAT còn lại của phần hóa đơn không hợp lệ');
		const weights = rows.map((row) => row.amount.subtotal);
		const discounts = allocateVnd(extraDiscount, weights);
		const taxes = allocateVnd(extraTax, weights);
		const shipping = allocateVnd(allocated.shipping_total, weights);
		const documentNumber = invoiceNumber(baseBh, partIndex, parts.length, false);
		const stockNumber = invoiceNumber(baseXk, partIndex, parts.length, false);
		documentNumbers.push(documentNumber);
		rows.forEach(({ item, amount }, index) => {
			const config = settings.items[item.id];
			if (!config?.unit?.trim() || !config.taxWarehouse?.trim() || !config.managementWarehouse?.trim() || ![0, 5, 8, 10].includes(config.taxRate)) fail(`Điền ĐVT, kho và thuế suất cho ${item.variant?.sku ?? item.id}`);
			const gross = amount.subtotal - amount.discount_total + amount.tax_total - discounts[index] + taxes[index] + shipping[index];
			if (!isVnd(gross)) fail(`Giá trị dòng ${item.variant?.sku ?? item.id} không hợp lệ`);
			quantityByLine.set(item.id, (quantityByLine.get(item.id) ?? 0) + amount.quantity);
			grossByLine.set(item.id, (grossByLine.get(item.id) ?? 0) + gross);
			const net = Math.round(gross / (1 + config.taxRate / 100));
			const vat = gross - net;
			const row: SmeExcelRow = {
				...baselineById.get(item.id)!,
				'Hiển thị trên sổ': 0,
				'Ngày hạch toán (*)': date,
				'Ngày chứng từ (*)': date,
				'Số chứng từ (*)': documentNumber,
				'Số phiếu xuất': stockNumber,
				'Ngày hóa đơn': part.is_issued && part.invoice_date ? excelDate(part.invoice_date) : '',
				'Mã khách hàng': part.misa_customer_code,
				'Tên khách hàng': part.misa_customer_code === 'NTD' ? part.consumer_name ?? '' : '',
				'Địa chỉ': part.misa_customer_code === 'NTD' ? part.consumer_address ?? '' : '',
				'Số lượng': amount.quantity,
				'ĐVT': config.unit.trim(),
				'Đơn giá sau thuế': Number((gross / amount.quantity).toFixed(6)),
				'Đơn giá': Number((net / amount.quantity).toFixed(6)),
				'Thành tiền': net,
				'Tiền chiết khấu': 0,
				'% thuế GTGT': String(config.taxRate),
				'Tiền thuế GTGT': vat,
				'Kho': config.taxWarehouse.trim(),
			};
			taxRows.push(row);
		});
		const partTotal = taxRows.filter((row) => row['Số chứng từ (*)'] === documentNumber).reduce((sum, row) => sum + Number(row['Thành tiền']) + Number(row['Tiền thuế GTGT']), 0);
		if (partTotal !== allocated.total) fail(`Chứng từ ${documentNumber} lệch tiền với phần hóa đơn`);
		taxDocuments.push({ number: documentNumber, customerCode: part.misa_customer_code, total: partTotal, quantity: part.items.reduce((sum, item) => sum + item.quantity, 0) });
	});

	const managementRows = sortedItems.map((item) => {
		const quantity = quantityByLine.get(item.id) ?? 0;
		if (quantity !== item.quantity) fail(`Mặt hàng ${item.variant?.sku ?? item.id} chưa phân đủ số lượng`);
		const gross = grossByLine.get(item.id) ?? 0;
		const config = settings.items[item.id];
		const row: SmeExcelRow = {
			...baselineById.get(item.id)!,
			'Hiển thị trên sổ': 1,
			'Ngày hạch toán (*)': date,
			'Ngày chứng từ (*)': date,
			'Số chứng từ (*)': invoiceNumber(baseBh, 0, parts.length, true),
			'Số phiếu xuất': invoiceNumber(baseXk, 0, parts.length, true),
			'Mã khách hàng': managementCode,
			'Số lượng': quantity,
			'ĐVT': config.unit.trim(),
			'Đơn giá sau thuế': Number((gross / quantity).toFixed(6)),
			'Đơn giá': Number((gross / quantity).toFixed(6)),
			'Thành tiền': gross,
			'Tiền chiết khấu': 0,
			'% thuế GTGT': '0',
			'Tiền thuế GTGT': 0,
			'Kho': config.managementWarehouse.trim(),
		};
		return row;
	});
	const managementTotal = totalFromRows(managementRows);
	const taxTotal = totalFromRows(taxRows);
	if (managementTotal !== order.total || taxTotal !== order.total) fail('Tổng file QT/TH không bằng tổng đơn; đã chặn xuất');
	return {
		managementRows, taxRows, managementTotal, taxTotal, documentNumbers, taxDocuments,
		assumptions: [
			'Giá trị các dòng là số tiền cuối cùng; chiết khấu và phí giao trên đơn đã phân bổ vào giá từng mặt hàng.',
			'Tổng thanh toán hai sổ bằng nhau; doanh thu chưa VAT sẽ khác vì sổ quản trị ghi VAT 0%, sổ thuế tính theo thuế suất từng mặt hàng.',
			'Ngày chứng từ/hạch toán dùng ngày đã chọn; ngày hóa đơn chỉ ghi khi phần hóa đơn đã xác nhận phát hành.',
		],
	};
}
