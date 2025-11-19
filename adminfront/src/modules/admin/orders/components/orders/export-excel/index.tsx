import { Order } from '@medusajs/medusa';
import dayjs from 'dayjs';

interface ExportOrderData {
	order: Order;
	soChungTu: string;
	soPhieuXuat: string;
	vatRate: number;
	customerCode: string;
}

export interface ExcelRow {
	'Hiển thị trên sổ': string | number;
	'Hình thức bán hàng': string;
	'Phương thức thanh toán': string | number;
	'Kiêm phiếu xuất kho': string | number;
	'XK vào khu phi thuế quan và các TH được coi như XK': string | number;
	'Lập kèm hóa đơn': string | number;
	'Đã lập hóa đơn': string | number;
	'Ngày hạch toán (*)': string;
	'Ngày chứng từ (*)': string;
	'Số chứng từ (*)': string;
	'Số phiếu xuất': string;
	'Lý do xuất': string;
	'Mẫu số HĐ': string;
	'Ký hiệu HĐ': string;
	'Số hóa đơn': string;
	'Ngày hóa đơn': string;
	'Mã khách hàng': string;
	'Tên khách hàng': string;
	'Địa chỉ': string;
	'Mã số thuế': string;
	'Diễn giải': string;
	'Nộp vào TK': string;
	'NV bán hàng': string;
	'Loại tiền': string;
	'Tỷ giá': string;
	'Mã hàng (*)': string;
	'Tên hàng': string;
	'Hàng khuyến mại': string;
	'TK Tiền/Chi phí/Nợ (*)': string | number;
	'TK Doanh thu/Có (*)': string | number;
	'ĐVT': string;
	'Số lượng': number;
	'Đơn giá sau thuế': string | number;
	'Đơn giá': number;
	'Thành tiền': number;
	'Thành tiền quy đổi': string | number;
	'Tỷ lệ CK (%)': string | number;
	'Tiền chiết khấu': string | number;
	'Tiền chiết khấu quy đổi': string | number;
	'TK chiết khấu': string;
	'Giá tính thuế XK': string | number;
	'% thuế XK': string | number;
	'Tiền thuế XK': string | number;
	'TK thuế XK': string;
	'% thuế GTGT': string | number;
	'Tỷ lệ tính thuế (Thuế suất KHAC)': string | number;
	'Tiền thuế GTGT': string | number;
	'Tiền thuế GTGT quy đổi': string | number;
	'TK thuế GTGT': string | number;
	'HH không TH trên tờ khai thuế GTGT': string;
	'Kho': string;
	'TK giá vốn': string | number;
	'TK Kho': string | number;
	'Đơn giá vốn': number;
	'Tiền vốn': number;
	'Hàng hóa giữ hộ/bán hộ': string;
}

export interface ExcelFile {
	orderId: string;
	displayId: number;
	soChungTu: string;
	soPhieuXuat: string;
	customerName: string;
	rows: ExcelRow[];
}

export const generateExcelData = (ordersData: ExportOrderData[]): ExcelFile[] => {
	const files: ExcelFile[] = [];

	ordersData.forEach(({ order, soChungTu, soPhieuXuat, vatRate, customerCode }) => {
		const rows: ExcelRow[] = [];
		// Get customer name
		const customerName = order.customer
			? `${order.customer.last_name || ''} ${order.customer.first_name || ''}`.trim()
			: order.email;
		
		// Use provided customer code (from manual selection)
		// If not provided, fall back to automatic mapping
		const finalCustomerCode = customerCode || '';

		// Format dates
		const ngayHachToan = dayjs(order.created_at).format('DD/MM/YYYY');
		const ngayChungTu = dayjs(order.created_at).format('DD/MM/YYYY');

		// Process each item in the order
		order.items?.forEach((item: any) => {
			const productTitle = item.variant?.product?.title || item.title;
			const variantTitle = item.variant?.title || item.description;
			const tenHang = `${productTitle} - ${variantTitle}`;
			const maHang = item.variant?.sku || '';
			const cogsPrice = item.variant?.cogs_price || 0;
			const tienVon = cogsPrice * item.quantity;

			const row: ExcelRow = {
				// Default values
				'Hiển thị trên sổ': 2,
				'Hình thức bán hàng': '',
				'Phương thức thanh toán': 0,
				'Kiêm phiếu xuất kho': 1,
				'XK vào khu phi thuế quan và các TH được coi như XK': 0,
				'Lập kèm hóa đơn': 0,
				'Đã lập hóa đơn': 0,

				// Date fields
				'Ngày hạch toán (*)': ngayHachToan,
				'Ngày chứng từ (*)': ngayChungTu,

				// User input
				'Số chứng từ (*)': soChungTu,
				'Số phiếu xuất': soPhieuXuat,

				// Empty fields
				'Lý do xuất': '',
				'Mẫu số HĐ': '',
				'Ký hiệu HĐ': '',
				'Số hóa đơn': '',
				'Ngày hóa đơn': '',
				'Mã khách hàng': finalCustomerCode,
				'Tên khách hàng': customerName,
				'Địa chỉ': '',
				'Mã số thuế': '',
				'Diễn giải': '',
				'Nộp vào TK': '',
				'NV bán hàng': '',
				'Loại tiền': '',
				'Tỷ giá': '',

				// Product data
				'Mã hàng (*)': maHang,
				'Tên hàng': tenHang,
				'Hàng khuyến mại': '',

				// Account codes
				'TK Tiền/Chi phí/Nợ (*)': 131,
				'TK Doanh thu/Có (*)': 5111,
				'ĐVT': 'Đôi',

				// Item quantities and prices
				'Số lượng': item.quantity,
				'Đơn giá sau thuế': '',
				'Đơn giá': item.unit_price,
				'Thành tiền': item.subtotal,
				'Thành tiền quy đổi': '',

				// Discount fields
				'Tỷ lệ CK (%)': '',
				'Tiền chiết khấu': '',
				'Tiền chiết khấu quy đổi': '',
				'TK chiết khấu': '',

				// Tax fields
				'Giá tính thuế XK': '',
				'% thuế XK': '',
				'Tiền thuế XK': '',
				'TK thuế XK': '',
				'% thuế GTGT': `${vatRate}`,
				'Tỷ lệ tính thuế (Thuế suất KHAC)': '',
				'Tiền thuế GTGT': item.subtotal * vatRate / 100,
				'Tiền thuế GTGT quy đổi': '',
				'TK thuế GTGT': 33311,
				'HH không TH trên tờ khai thuế GTGT': '',

				// Warehouse and cost
				'Kho': 'KHH',
				'TK giá vốn': 632,
				'TK Kho': 156,
				'Đơn giá vốn': cogsPrice,
				'Tiền vốn': tienVon,
				'Hàng hóa giữ hộ/bán hộ': '',
			};

			rows.push(row);
		});

		// Create a file object for this order
		files.push({
			orderId: order.id,
			displayId: order.display_id,
			soChungTu,
			soPhieuXuat,
			customerName,
			rows,
		});
	});

	return files;
};

