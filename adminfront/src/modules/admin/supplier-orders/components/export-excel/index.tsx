import { SupplierOrder } from '@/types/supplier-order';
import dayjs from 'dayjs';

export interface ExportSupplierOrderData {
	supplierOrder: SupplierOrder;
	soChungTu: string;
	soPhieuNhap: string;
	vatRate: number;
	tiGia: number;
}

export interface AmisExcelRow {
	'Hình thức mua hàng': string;
	'Phương thức thanh toán': string;
	'Ngày hạch toán (*)': string;
	'Ngày chứng từ (*)': string;
	'Số phiếu nhập (*)': string;
	'Số chứng từ ghi nợ/Số chứng từ thanh toán': string;
	'Mẫu số HĐ': string;
	'Ký hiệu HĐ': string;
	'Số hóa đơn': string;
	'Ngày hóa đơn': string;
	'Số tài khoản chi': string;
	'Tên ngân hàng chi': string;
	'Mã nhà cung cấp': string;
	'Tên nhà cung cấp': string;
	'Địa chỉ': string;
	'Mã số thuế': string;
	'Người giao hàng': string;
	'Diễn giải': string;
	'Số tài khoản nhận': string;
	'Tên ngân hàng nhận': string;
	'Lý do chi/nội dung thanh toán': string;
	'Mã nhân viên mua hàng': string;
	'Số lượng chứng từ kèm theo': string | number;
	'Hạn thanh toán': string;
	'Loại tiền': string;
	'Tỷ giá': string | number;
	'Mã hàng (*)': string;
	'Tên hàng': string;
	'Là dòng ghi chú': string;
	'Mã kho': string;
	'Hàng hóa giữ hộ/bán hộ': string;
	'TK kho/TK chi phí (*)': string | number;
	'TK công nợ/TK tiền (*)': string | number;
	'ĐVT': string;
	'Số lượng': number;
	'Đơn giá': string | number;
	'Thành tiền': string | number;
	'Thành tiền quy đổi': string | number;
	'Tỷ lệ CK (%)': string | number;
	'Tiền chiết khấu': string | number;
	'Tiền chiết khấu quy đổi': string | number;
	'Phí trước hải quan': string | number;
	'Phí hàng về kho/Chi phí mua hàng': string | number;
	'Số Lệnh sản xuất': string;
	'Mã khoản mục chi phí': string;
	'Mã đơn vị': string;
	'Mã đối tượng THCP': string;
	'Mã công trình': string;
	'Số đơn đặt hàng': string;
	'Số đơn mua hàng': string;
	'Số hợp đồng mua': string;
	'Số hợp đồng bán': string;
	'Mã thống kê': string;
	'Số khế ước đi vay': string;
	'Số khế ước cho vay': string;
	'CP không hợp lý': string;
	'Giá tính thuế NK bằng ngoại tệ': string | number;
	'Giá tính thuế NK': string | number;
	'% thuế NK': string | number;
	'Tiền thuế NK': string | number;
	'TK thuế NK': string | number;
	'% Thuế CBPG': string | number;
	'Tiền thuế CBPG': string | number;
	'TK Thuế CBPG': string | number;
	'% thuế TTĐB': string | number;
	'Tiền thuế TTĐB': string | number;
	'TK thuế TTĐB hàng NK': string | number;
	'TK thuế TTĐB': string | number;
	'Tiền thuế BVMT': string | number;
	'TK thuế BVMT': string | number;
	'% thuế GTGT': string | number;
	'% thuế suất KHAC': string | number;
	'Tiền thuế GTGT': string | number;
	'TKĐƯ thuế GTGT': string | number;
	'TK thuế GTGT': string | number;
	'Nhóm HHDV mua vào': string | number;
}

export interface SmeExcelRow {
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
	'Thành tiền': string | number;
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

export type ExcelRow = AmisExcelRow | SmeExcelRow;

export interface ExcelFile {
	supplierOrderId: string;
	displayId: number;
	soChungTu: string;
	soPhieuNhap: string;
	supplierName: string;
	rows: ExcelRow[];
}

export const generateAmisExcelData = (
	ordersData: ExportSupplierOrderData[]
): ExcelFile[] => {
	const files: ExcelFile[] = [];

	ordersData.forEach(({ supplierOrder, soChungTu, soPhieuNhap, vatRate, tiGia }) => {
		const rows: AmisExcelRow[] = [];

		// Get supplier name
		const supplierName = supplierOrder.supplier?.supplier_name || '';
		
		// Get supplier code
		const supplierCode = supplierOrder.supplier?.supplier_code || '';

		// Format dates
		const ngayHachToan = dayjs(supplierOrder.created_at).format('DD/MM/YYYY');
		const ngayChungTu = dayjs(supplierOrder.created_at).format('DD/MM/YYYY');

		// Process each item
		supplierOrder.items?.forEach((item: any) => {
			const productTitle = item.variant?.product?.title || item.title;
			const variantTitle = item.variant?.title || item.description;
			const tenHang = `${productTitle} - ${variantTitle}`;
			const maHang = item.variant?.sku || '';

			// Calculate amounts
			const thanhTienQuyDoi = item.subtotal || item.quantity * item.unit_price;
			const thanhTien = thanhTienQuyDoi / tiGia;
			const donGia = thanhTien / item.quantity;
			// Amount in VND (quy đổi) is primarily used for final value if currency is different
			// If currency is different, 'Thành tiền' is in foreign currency, 'Thành tiền quy đổi' is in base currency (VND)
			// Assuming input unit_price is in base currency for now or handled by tiGia

			const row: AmisExcelRow = {
				'Hình thức mua hàng': 'Mua hàng nhập khẩu nhập kho',
				'Phương thức thanh toán': 'Chưa thanh toán',
				'Ngày hạch toán (*)': ngayHachToan,
				'Ngày chứng từ (*)': ngayChungTu,
				'Số phiếu nhập (*)': soPhieuNhap,
				'Số chứng từ ghi nợ/Số chứng từ thanh toán': '',
				'Mẫu số HĐ': '',
				'Ký hiệu HĐ': '',
				'Số hóa đơn': '',
				'Ngày hóa đơn': '',
				'Số tài khoản chi': '',
				'Tên ngân hàng chi': '',
				'Mã nhà cung cấp': supplierCode,
				'Tên nhà cung cấp': supplierName,
				'Địa chỉ': '',
				'Mã số thuế': '',
				'Người giao hàng': '',
				'Diễn giải': `Mua hàng từ ${supplierName}`,
				'Số tài khoản nhận': '',
				'Tên ngân hàng nhận': '',
				'Lý do chi/nội dung thanh toán': '',
				'Mã nhân viên mua hàng': '',
				'Số lượng chứng từ kèm theo': 0,
				'Hạn thanh toán': '',
				'Loại tiền': 'THB', // Default to VND, user can change if needed or based on order currency
				'Tỷ giá': tiGia,
				'Mã hàng (*)': maHang,
				'Tên hàng': '',
				'Là dòng ghi chú': 'không',
				'Mã kho': 'KHH-HCM',
				'Hàng hóa giữ hộ/bán hộ': '',
				'TK kho/TK chi phí (*)': 156,
				'TK công nợ/TK tiền (*)': 331,
				'ĐVT': 'Đôi',
				'Số lượng': item.quantity,
				'Đơn giá': donGia,
				'Thành tiền': '',
				'Thành tiền quy đổi': '',
				'Tỷ lệ CK (%)': '',
				'Tiền chiết khấu': '',
				'Tiền chiết khấu quy đổi': '',
				'Phí trước hải quan': '',
				'Phí hàng về kho/Chi phí mua hàng': '',
				'Số Lệnh sản xuất': '',
				'Mã khoản mục chi phí': '',
				'Mã đơn vị': '',
				'Mã đối tượng THCP': '',
				'Mã công trình': '',
				'Số đơn đặt hàng': '',
				'Số đơn mua hàng': '',
				'Số hợp đồng mua': '',
				'Số hợp đồng bán': '',
				'Mã thống kê': '',
				'Số khế ước đi vay': '',
				'Số khế ước cho vay': '',
				'CP không hợp lý': 'Không',
				'Giá tính thuế NK bằng ngoại tệ': '',
				'Giá tính thuế NK': '',
				'% thuế NK': '',
				'Tiền thuế NK': 0,
				'TK thuế NK': 3333,
				'% Thuế CBPG': '',
				'Tiền thuế CBPG': '',
				'TK Thuế CBPG': '',
				'% thuế TTĐB': '',
				'Tiền thuế TTĐB': '',
				'TK thuế TTĐB hàng NK': '',
				'TK thuế TTĐB': 3332,
				'Tiền thuế BVMT': '',
				'TK thuế BVMT': '',
				'% thuế GTGT': `${vatRate}`,
				'% thuế suất KHAC': '',
				'Tiền thuế GTGT': 0,
				'TKĐƯ thuế GTGT': 1331,
				'TK thuế GTGT': 33312,
				'Nhóm HHDV mua vào': 1,
			};

			rows.push(row);
		});

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

export const generateSmeExcelData = (
	ordersData: ExportSupplierOrderData[]
): ExcelFile[] => {
	const files: ExcelFile[] = [];

	ordersData.forEach(({ supplierOrder, soChungTu, soPhieuNhap, vatRate, tiGia }) => {
		const rows: SmeExcelRow[] = [];

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


			const row: SmeExcelRow = {
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
				'Số chứng từ thanh toán': '',

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
				'Tên hàng': '',
				'Kho': 'KHH-HCM',
				'Hàng hóa giữ hộ/bán hộ': '',

				// Account codes for purchases
				'TK kho (*)': 156, // Tài khoản kho hàng hóa
				'TK công nợ/TK tiền (*)': 331, // Tài khoản phải trả người bán
				'ĐVT': 'Đôi',

				// Item quantities and prices
				'Số lượng': item.quantity,
				'Đơn giá': donGia,
				'Thành tiền': '',
				'Thành tiền quy đổi': '',

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
