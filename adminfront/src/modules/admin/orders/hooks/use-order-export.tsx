import { Order } from '@medusajs/medusa';
import { useState } from 'react';
import { downloadExcelFiles } from '../components/orders/export-excel/download';
import { generateExcelData } from '../components/orders/export-excel';

export const useOrderExport = () => {
	const [vatModalVisible, setVatModalVisible] = useState<boolean>(false);
	const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
	const [customerMappingModalVisible, setCustomerMappingModalVisible] = useState<boolean>(false);
	const [vatRate, setVatRate] = useState<number>(8);
	const [soChungTuValues, setSoChungTuValues] = useState<Record<string, string>>({});
	const [soPhieuXuatValues, setSoPhieuXuatValues] = useState<Record<string, string>>({});
	const [customerMappings, setCustomerMappings] = useState<Record<string, string>>({});

	const handleOpenExportModal = (selectedKeys: React.Key[]) => {
		// Show VAT modal first
		setVatModalVisible(true);
	};

	const handleVatNext = (selectedKeys: React.Key[]) => {
		// Close VAT modal and open document modal
		setVatModalVisible(false);
		setExportModalVisible(true);
		// Initialize soChungTuValues and soPhieuXuatValues for selected orders
		const initialValues: Record<string, string> = {};
		selectedKeys.forEach(key => {
			initialValues[key.toString()] = '';
		});
		setSoChungTuValues(initialValues);
		setSoPhieuXuatValues(initialValues);
	};

	const handleVatCancel = () => {
		setVatModalVisible(false);
	};

	const handleCloseExportModal = () => {
		setExportModalVisible(false);
		setSoChungTuValues({});
		setSoPhieuXuatValues({});
	};

	const handleDocumentModalNext = () => {
		// Close document modal and open customer mapping modal
		setExportModalVisible(false);
		setCustomerMappingModalVisible(true);
	};

	const handleCustomerMappingConfirm = (
		mappings: Record<string, string>,
		selectedOrders: Order[],
		onComplete: () => void
	) => {
		setCustomerMappings(mappings);
		setCustomerMappingModalVisible(false);
		
		// Prepare data for Excel generation
		const ordersData = selectedOrders.map(order => ({
			order,
			soChungTu: soChungTuValues[order.id] || '',
			soPhieuXuat: soPhieuXuatValues[order.id] || '',
			vatRate: vatRate,
			customerCode: mappings[order.id] || ''
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

	const handleCustomerMappingCancel = () => {
		setCustomerMappingModalVisible(false);
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
		customerMappingModalVisible,
		vatRate,
		soChungTuValues,
		soPhieuXuatValues,
		customerMappings,
		// Setters
		setVatRate,
		// Handlers
		handleOpenExportModal,
		handleVatNext,
		handleVatCancel,
		handleCloseExportModal,
		handleDocumentModalNext,
		handleCustomerMappingConfirm,
		handleCustomerMappingCancel,
		handleSoChungTuChange,
		handleSoPhieuXuatChange,
	};
};

