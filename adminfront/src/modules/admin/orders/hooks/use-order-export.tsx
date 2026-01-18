import { Order } from '@medusajs/medusa';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ICustomerResponse } from '@/types/customer';
import { downloadExcelFiles } from '../components/orders/export-excel/download';
import { generateAmisExcelData, generateSmeExcelData } from '../components/orders/export-excel';
import { ExportType } from '../components/orders/export-excel/export-modals';

export const useOrderExport = () => {
	const [vatModalVisible, setVatModalVisible] = useState<boolean>(false);
	const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
	const [exportTypeModalVisible, setExportTypeModalVisible] = useState<boolean>(false);
	const [vatRate, setVatRate] = useState<number>(8);
	const [soChungTuValues, setSoChungTuValues] = useState<Record<string, string>>({});
	const [soPhieuXuatValues, setSoPhieuXuatValues] = useState<Record<string, string>>({});
	
	// Store pending data for final step
	const [pendingExportData, setPendingExportData] = useState<{orders: Order[], onComplete: () => void} | null>(null);

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

		// Close document modal and open export type modal
		setExportModalVisible(false);
		setExportTypeModalVisible(true);
		
		// Save pending data
		setPendingExportData({ orders: selectedOrders, onComplete });
	};

	const handleExportTypeNext = (type: ExportType) => {
		if (!pendingExportData) return;
		
		const { orders, onComplete } = pendingExportData;

		// Prepare data for Excel generation
		const ordersData = orders.map(order => ({
			order,
			soChungTu: soChungTuValues[order.id] || '',
			soPhieuXuat: soPhieuXuatValues[order.id] || '',
			vatRate: vatRate,
		}));

		// Generate Excel data structure based on type
		let excelFiles;
		if (type === 'AMIS') {
			excelFiles = generateAmisExcelData(ordersData);
		} else {
			excelFiles = generateSmeExcelData(ordersData);
		}
		
		console.log(`=== EXCEL EXPORT DATA (${type}) ===`);
		console.log(`Total Files to Export: ${excelFiles.length}`);
		
		// Download Excel files
		downloadExcelFiles(excelFiles).then((success) => {
			if (success) {
				console.log('✅ Excel files downloaded successfully!');
				message.success('Xuất file Excel thành công!');
			} else {
				console.error('❌ Failed to download Excel files.');
				message.error('Có lỗi xảy ra khi xuất file Excel.');
			}
		});
		
		// Clear selection and state
		setExportTypeModalVisible(false);
		setPendingExportData(null);
		onComplete();
	};

	const handleExportTypeCancel = () => {
		setExportTypeModalVisible(false);
		// Go back to document modal or close all? 
		// Usually back to document modal is better UX, but let's just close for simplicity or reopen document modal
		// Let's go back to document modal
		setExportModalVisible(true);
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
		exportTypeModalVisible,
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
		handleExportTypeNext,
		handleExportTypeCancel,
		handleSoChungTuChange,
		handleSoPhieuXuatChange,
	};
};
