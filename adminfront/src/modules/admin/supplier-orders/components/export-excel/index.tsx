import { SupplierOrder } from '@/types/supplier-order';
import dayjs from 'dayjs';

interface ExportSupplierOrderData {
	supplierOrder: SupplierOrder;
	soChungTu: string;
	soPhieuNhap: string;
	vatRate: number;
	tiGia: number;
}

export interface ExcelRow {
	'Hiển thị trên sổ': string | number;
	'Hình thức mua hàng': string | number;
	'Phương thức thanh toán': string | number;
	'Nhận kèm hóa đơn': string | number;
	'Ngày hạch toán (*)': string;
	'Ngày chứng từ (*)': string;
	'Số phiếu nhập (*)': string;
	'Số chứng từ thanh toán': string;
	'Mẫu số HĐ': string;
	'Ký hiệu HĐ': string;
	'Số hóa đơn': string;
	'Ngày hóa đơn': string;
	'Mã nhà cung cấp': string;
	'Tên nhà cung cấp': string;
	'Người giao hàng': string;
	'Diễn giải': string;
	'NV mua hàng': string;
	'Loại tiền': string;
	'Tỷ giá': string | number;
	'Mã hàng (*)': string;
	'Tên hàng': string;
	'Kho': string;
	'Hàng hóa giữ hộ/bán hộ': string;
	'TK kho (*)': string | number;
	'TK công nợ/TK tiền (*)': string | number;
	'ĐVT': string;
	'Số lượng': number;
	'Đơn giá': string | number;
	'Thành tiền': number;
	'Thành tiền quy đổi': string | number;
	'Tỷ lệ CK': string | number;
	'Tiền chiết khấu': string | number;
	'Tiền chiết khấu quy đổi': string | number;
	'Phí hàng về kho/Chi phí mua hàng': string | number;
	'% thuế GTGT': string | number;
	'Tỷ lệ tính thuế (Thuế suất KHAC)': string | number;
	'Tiền thuế GTGT': string | number;
	'Tiền thuế GTGT quy đổi': string | number;
	'TKĐƯ thuế GTGT': string | number;
	'TK thuế GTGT': string | number;
	'Nhóm HHDV mua vào': string | number;
	'Phí trước hải quan': string | number;
	'Giá tính thuế NK': string | number;
	'% thuế NK': string | number;
	'Tiền thuế NK': string | number;
	'TK thuế NK': string | number;
	'% thuế TTĐB': string | number;
	'Tiền thuế TTĐB': string | number;
	'TK thuế TTĐB': string | number;
}

export interface ExcelFile {
	supplierOrderId: string;
	displayId: number;
	soChungTu: string;
	soPhieuNhap: string;
	supplierName: string;
	rows: ExcelRow[];
}

export const generateSupplierOrderExcelData = (
	ordersData: ExportSupplierOrderData[]
): ExcelFile[] => {
	const files: ExcelFile[] = [];

	ordersData.forEach(({ supplierOrder, soChungTu, soPhieuNhap, vatRate, tiGia }) => {
		const rows: ExcelRow[] = [];

		// Get supplier name
		const supplierName = supplierOrder.supplier?.supplier_name || '';

		// Format dates
		const ngayHachToan = dayjs(supplierOrder.created_at).format('DD/MM/YYYY');
		const ngayChungTu = dayjs(supplierOrder.created_at).format('DD/MM/YYYY');

		// Process each item in the supplier order
		supplierOrder.items?.forEach((item: any) => {
			const productTitle = item.variant?.product?.title || item.title;
			const variantTitle = item.variant?.title || item.description;
			const tenHang = `${productTitle} - ${variantTitle}`;
			const maHang = item.variant?.sku || '';

			// Calculate amounts with exchange rate
			const thanhTienQuyDoi = item.subtotal || item.quantity * item.unit_price;
			const thanhTien = thanhTienQuyDoi / tiGia;
			const donGia = thanhTien / item.quantity;


			const row: ExcelRow = {
				// Default values
				'Hiển thị trên sổ': 1,
				'Hình thức mua hàng': 1,
				'Phương thức thanh toán': 0,
				'Nhận kèm hóa đơn': 1,

				// Date fields
				'Ngày hạch toán (*)': ngayHachToan,
				'Ngày chứng từ (*)': ngayChungTu,

				// User input
				'Số phiếu nhập (*)': soPhieuNhap,
				'Số chứng từ thanh toán': soChungTu,

				// Invoice information
				'Mẫu số HĐ': '',
				'Ký hiệu HĐ': '',
				'Số hóa đơn': '',
				'Ngày hóa đơn': '',

				// Supplier information
				'Mã nhà cung cấp': supplierOrder.supplier?.supplier_code || '',
				'Tên nhà cung cấp': supplierName,
				'Người giao hàng': '',

				// Description
				'Diễn giải': `Mua hàng từ ${supplierName}`,
				'NV mua hàng': '',
				'Loại tiền': 'THB',
				'Tỷ giá': tiGia,

				// Product data
				'Mã hàng (*)': maHang,
				'Tên hàng': tenHang,
				'Kho': 'KHH-HCM',
				'Hàng hóa giữ hộ/bán hộ': '',

				// Account codes for purchases
				'TK kho (*)': 156, // Tài khoản kho hàng hóa
				'TK công nợ/TK tiền (*)': 331, // Tài khoản phải trả người bán
				'ĐVT': 'Đôi',

				// Item quantities and prices
				'Số lượng': item.quantity,
				'Đơn giá': donGia,
				'Thành tiền': thanhTien,
				'Thành tiền quy đổi': thanhTienQuyDoi,

				// Discount fields
				'Tỷ lệ CK': '',
				'Tiền chiết khấu': '',
				'Tiền chiết khấu quy đổi': '',
				'Phí hàng về kho/Chi phí mua hàng': '',

				// Tax fields
				'% thuế GTGT': `${vatRate}`,
				'Tỷ lệ tính thuế (Thuế suất KHAC)': '',
				'Tiền thuế GTGT': '',
				'Tiền thuế GTGT quy đổi': '',
				'TKĐƯ thuế GTGT': 1331, // Tài khoản thuế GTGT được khấu trừ
				'TK thuế GTGT': 33312, // Tài khoản thuế GTGT phải nộp
				'Nhóm HHDV mua vào': 1,

				// Import tax fields
				'Phí trước hải quan': '',
				'Giá tính thuế NK': '',
				'% thuế NK': '',
				'Tiền thuế NK': '',
				'TK thuế NK': 3333,

				// Special consumption tax
				'% thuế TTĐB': '',
				'Tiền thuế TTĐB': '',
				'TK thuế TTĐB': 3332,
			};

			rows.push(row);
		});

		// Create a file object for this supplier order
		files.push({
			supplierOrderId: supplierOrder.id,
			displayId: supplierOrder.display_id,
			soChungTu,
			soPhieuNhap,
			supplierName,
			rows,
		});
	});

	return files;
};

