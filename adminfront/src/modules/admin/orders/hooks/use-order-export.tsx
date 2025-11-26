import { Order } from '@medusajs/medusa';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ICustomerResponse } from '@/types/customer';
import { downloadExcelFiles } from '../components/orders/export-excel/download';
import { generateExcelData } from '../components/orders/export-excel';

export const useOrderExport = () => {
	const [vatModalVisible, setVatModalVisible] = useState<boolean>(false);
	const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
	const [vatRate, setVatRate] = useState<number>(8);
	const [soChungTuValues, setSoChungTuValues] = useState<Record<string, string>>({});
	const [soPhieuXuatValues, setSoPhieuXuatValues] = useState<Record<string, string>>({});

	const handleOpenExportModal = (selectedKeys: React.Key[]) => {
		// Show VAT modal first
		setVatModalVisible(true);
	};

	const handleVatNext = (selectedKeys: React.Key[], selectedOrders: Order[]) => {
		// Close VAT modal and open document modal
		setVatModalVisible(false);
		setExportModalVisible(true);
		
		// Auto-generate soChungTu and soPhieuXuat values
		const soChungTuInitial: Record<string, string> = {};
		const soPhieuXuatInitial: Record<string, string> = {};
		
		selectedOrders.forEach(order => {
			const year = dayjs(order.created_at).format('YY');
			const month = dayjs(order.created_at).format('MM');
			const displayId = order.display_id;
			
			// Format: BH + year + month + -display_id (e.g., BH2511-1)
			soChungTuInitial[order.id] = `BH${year}${month}-${displayId}`;
			
			// Format: XK + year + month + -display_id (e.g., XK2511-1)
			soPhieuXuatInitial[order.id] = `XK${year}${month}-${displayId}`;
		});
		
		setSoChungTuValues(soChungTuInitial);
		setSoPhieuXuatValues(soPhieuXuatInitial);
	};

	const handleVatCancel = () => {
		setVatModalVisible(false);
	};

	const handleCloseExportModal = () => {
		setExportModalVisible(false);
		setSoChungTuValues({});
		setSoPhieuXuatValues({});
	};

	const handleDocumentModalNext = (selectedOrders: Order[], onComplete: () => void) => {
		// Validate customer_code for all orders
		const ordersWithoutCustomerCode = selectedOrders.filter(order => {
			const customer = order.customer as ICustomerResponse | undefined;
			return !customer?.customer_code;
		});

		if (ordersWithoutCustomerCode.length > 0) {
			message.warning(`Khách hàng ${ordersWithoutCustomerCode[0].customer?.first_name} chưa có mã khách hàng. Vui lòng cập nhật mã khách hàng trong trang quản lý khách hàng.`);
			return;
		}

		// Close document modal and proceed to Excel generation
		setExportModalVisible(false);
		
		// Prepare data for Excel generation
		const ordersData = selectedOrders.map(order => ({
			order,
			soChungTu: soChungTuValues[order.id] || '',
			soPhieuXuat: soPhieuXuatValues[order.id] || '',
			vatRate: vatRate,
		}));

		// Generate Excel data structure (one file per order)
		const excelFiles = generateExcelData(ordersData);
		
		console.log('=== EXCEL EXPORT DATA ===');
		console.log(`Total Files to Export: ${excelFiles.length}`);
		console.log('');
		
		excelFiles.forEach((file, index) => {
			console.log(`📄 File ${index + 1}:`);
			console.log(`   Order Display ID: ${file.displayId}`);
			console.log(`   Customer: ${file.customerName}`);
			console.log(`   Số chứng từ: ${file.soChungTu}`);
			console.log(`   Số phiếu xuất: ${file.soPhieuXuat}`);
			console.log(`   Total Items (Rows): ${file.rows.length}`);
			console.log(`   Data:`, file.rows);
			console.log('');
		});
		
		// Download Excel files
		downloadExcelFiles(excelFiles).then((success) => {
			if (success) {
				console.log('✅ Excel files downloaded successfully!');
			} else {
				console.error('❌ Failed to download Excel files. Make sure xlsx library is installed: yarn add xlsx');
			}
		});
		
		// Clear selection
		onComplete();
	};

	const handleSoChungTuChange = (orderId: string, value: string) => {
		setSoChungTuValues(prev => ({
			...prev,
			[orderId]: value
		}));
	};

	const handleSoPhieuXuatChange = (orderId: string, value: string) => {
		setSoPhieuXuatValues(prev => ({
			...prev,
			[orderId]: value
		}));
	};

	return {
		// State
		vatModalVisible,
		exportModalVisible,
		vatRate,
		soChungTuValues,
		soPhieuXuatValues,
		// Setters
		setVatRate,
		// Handlers
		handleOpenExportModal,
		handleVatNext,
		handleVatCancel,
		handleCloseExportModal,
		handleDocumentModalNext,
		handleSoChungTuChange,
		handleSoPhieuXuatChange,
	};
};

