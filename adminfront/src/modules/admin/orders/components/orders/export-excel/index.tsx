import { Order } from '@medusajs/medusa';
import dayjs from 'dayjs';
import { ICustomerResponse } from '@/types/customer';

interface ExportOrderData {
	order: Order;
	soChungTu: string;
	soPhieuXuat: string;
	vatRate: number;
}

export interface ExcelRow {
	'Hình thức bán hàng': string;
	'Phương thức thanh toán': string | number;
	'Kiêm phiếu xuất kho': string | number;
	'Lập kèm hóa đơn': string | number;
	'Đã lập hóa đơn': string | number;
	'Ngày hạch toán (*)': string;
	'Ngày chứng từ (*)': string;
	'Số chứng từ (*)': string;
	'Số phiếu xuất': string;
	'Mẫu số HĐ': string;
	'Ký hiệu HĐ': string;
	'Số hóa đơn': string;
	'Ngày hóa đơn': string;
	'Mã khách hàng': string;
	'Tên khách hàng': string;
	'Địa chỉ': string;
	'Mã số thuế': string;
	'Đơn vị giao đại lý': string;
	'Người nộp': string;
	'Nộp vào TK': string;
	'Tên ngân hàng': string;
	'Diễn giải/Lý do nộp': string;
	'Lý do xuất': string;
	'Loại tiền': string;
	'Tỷ giá': string;
	'Mã hàng (*)': string;
	'Tên hàng': string;
	'Là dòng ghi chú': string;
	'Hàng khuyến mại': string;
	'Chiết khấu thương mại': string;
	'TK Tiền/Chi phí/Nợ (*)': string | number;
	'TK Doanh thu/Có (*)': string | number;
	'ĐVT': string;
	'Số lượng': number;
	'Đơn giá': string | number;
	'Thành tiền': string | number;
	'Thành tiền quy đổi': string | number;
	'Tỷ lệ CK (%)': string | number;
	'Tiền chiết khấu': string | number;
	'Tiền chiết khấu quy đổi': string | number;
	'TK chiết khấu': string;
	'Giá tính thuế XK': string | number;
	'% thuế xuất khẩu': string | number;
	'Tiền thuế xuất khẩu': string | number;
	'TK thuế xuất khẩu': string;
	'% thuế GTGT': string | number;
	'% thuế suất KHAC': string | number;
	'Tiền thuế GTGT': string | number;
	'Tiền thuế GTGT quy đổi': string | number;
	'TK thuế GTGT': string | number;
	'HH không TH trên tờ khai thuế GTGT': string;
	'Mã kho': string;
	'TK giá vốn': string | number;
	'TK Kho': string | number;
	'Đơn giá vốn': string | number;
	'Tiền vốn': string | number;
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

	ordersData.forEach(({ order, soChungTu, soPhieuXuat, vatRate }) => {
		const rows: ExcelRow[] = [];
		// Get customer name
		const customerName = order.customer
			? `${order.customer.last_name || ''} ${order.customer.first_name || ''}`.trim()
			: order.email;

		// Get customer code from order
		const customer = order.customer as ICustomerResponse | undefined;
		const finalCustomerCode = customer?.customer_code || '';

		// Format dates
		const ngayHachToan = dayjs(order.created_at).format('DD/MM/YYYY');
		const ngayChungTu = dayjs(order.created_at).format('DD/MM/YYYY');

		// Sort items by SKU first, then process
		const sortedItems = [...(order.items || [])].sort((a: any, b: any) => {
			const skuA = a.variant?.sku || '';
			const skuB = b.variant?.sku || '';
			return skuA.localeCompare(skuB);
		});

		sortedItems.forEach((item: any) => {
			const productTitle = item.variant?.product?.title || item.title;
			const variantTitle = item.variant?.title || item.description;
			const tenHang = `${productTitle} - ${variantTitle}`;
			const maHang = item.variant?.sku || '';
			const cogsPrice = item.variant?.cogs_price || 0;
			const tienVon = cogsPrice * item.quantity;

			const row: ExcelRow = {
				'Hình thức bán hàng': 'Bán hàng hóa trong nước',
				'Phương thức thanh toán': 'Chưa thu tiền',
				'Kiêm phiếu xuất kho': 'Có',
				'Lập kèm hóa đơn': 'Không',
				'Đã lập hóa đơn': 'Chưa lập',
				'Ngày hạch toán (*)': ngayHachToan,
				'Ngày chứng từ (*)': ngayChungTu,
				'Số chứng từ (*)': soChungTu,
				'Số phiếu xuất': soPhieuXuat,
				'Mẫu số HĐ': '',
				'Ký hiệu HĐ': '',
				'Số hóa đơn': '',
				'Ngày hóa đơn': '',
				'Mã khách hàng': finalCustomerCode,
				'Tên khách hàng': customerName,
				// 'Tên khách hàng': customerName,
				'Địa chỉ': '',
				'Mã số thuế': '',
				'Đơn vị giao đại lý': '',
				'Người nộp': '',
				'Nộp vào TK': '',
				'Tên ngân hàng': '',
				'Diễn giải/Lý do nộp': `Bán hàng ${customerName}`,
				'Lý do xuất': `Xuất kho bán hàng ${customerName}`,
				'Loại tiền': '',
				'Tỷ giá': '',
				'Mã hàng (*)': maHang,
				'Tên hàng': tenHang,
				// 'Tên hàng': tenHang,
				'Là dòng ghi chú': '',
				'Hàng khuyến mại': '',
				'Chiết khấu thương mại': '',
				'TK Tiền/Chi phí/Nợ (*)': 131,
				'TK Doanh thu/Có (*)': 5111,
				'ĐVT': 'Đôi',
				'Số lượng': item.quantity,
				'Đơn giá': Math.round(item.unit_price / (1 + vatRate / 100)),
				'Thành tiền': '',
				'Thành tiền quy đổi': '',
				'Tỷ lệ CK (%)': '',
				'Tiền chiết khấu': '',
				'Tiền chiết khấu quy đổi': '',
				'TK chiết khấu': '',
				'Giá tính thuế XK': '',
				'% thuế xuất khẩu': '',
				'Tiền thuế xuất khẩu': '',
				'TK thuế xuất khẩu': '',
				'% thuế GTGT': `${vatRate}`,
				'% thuế suất KHAC': '',
				'Tiền thuế GTGT': '',
				'Tiền thuế GTGT quy đổi': '',
				'TK thuế GTGT': 33311,
				'HH không TH trên tờ khai thuế GTGT': '',
				'Mã kho': 'KHH-HCM',
				'TK giá vốn': 632,
				'TK Kho': 156,
				'Đơn giá vốn': '',
				'Tiền vốn': '',
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
