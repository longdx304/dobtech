import { SupplierOrder } from '@/types/supplier-order';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { downloadExcelFiles } from '../components/export-excel/download';
import { generateSupplierOrderExcelData } from '../components/export-excel';

export const useSupplierOrderExport = () => {
	const [vatModalVisible, setVatModalVisible] = useState<boolean>(false);
	const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
	const [vatRate, setVatRate] = useState<number>(8);
	const [tiGia, setTiGia] = useState<number>(1);
	const [soChungTuValues, setSoChungTuValues] = useState<
		Record<string, string>
	>({});
	const [soPhieuNhapValues, setSoPhieuNhapValues] = useState<
		Record<string, string>
	>({});

	const handleOpenExportModal = (selectedKeys: React.Key[]) => {
		// Show VAT modal first
		setVatModalVisible(true);
	};

	const handleVatNext = (
		selectedKeys: React.Key[],
		selectedSupplierOrders: SupplierOrder[]
	) => {
		// Close VAT modal and open document modal
		setVatModalVisible(false);
		setExportModalVisible(true);

		// Auto-generate soChungTu and soPhieuNhap values
		const soChungTuInitial: Record<string, string> = {};
		const soPhieuNhapInitial: Record<string, string> = {};

		selectedSupplierOrders.forEach((supplierOrder) => {
			const year = dayjs(supplierOrder.created_at).format('YY');
			const month = dayjs(supplierOrder.created_at).format('MM');
			const displayId = supplierOrder.display_id;

			// Format: MH + year + month + -display_id (e.g., MH2511-1) - Mua hàng
			soChungTuInitial[supplierOrder.id] = `MH${year}${month}-${displayId}`;

			// Format: NK + year + month + -display_id (e.g., NK2511-1) - Nhập kho
			soPhieuNhapInitial[supplierOrder.id] = `NK${year}${month}-${displayId}`;
		});

		setSoChungTuValues(soChungTuInitial);
		setSoPhieuNhapValues(soPhieuNhapInitial);
	};

	const handleVatCancel = () => {
		setVatModalVisible(false);
	};

	const handleCloseExportModal = () => {
		setExportModalVisible(false);
		setSoChungTuValues({});
		setSoPhieuNhapValues({});
	};

	const handleDocumentModalNext = (
		selectedSupplierOrders: SupplierOrder[],
		onComplete: () => void
	) => {
		// Close document modal and proceed to Excel generation
		setExportModalVisible(false);

		// Prepare data for Excel generation
		const ordersData = selectedSupplierOrders.map((supplierOrder) => ({
			supplierOrder,
			soChungTu: soChungTuValues[supplierOrder.id] || '',
			soPhieuNhap: soPhieuNhapValues[supplierOrder.id] || '',
			vatRate: vatRate,
			tiGia: tiGia,
		}));

		// Generate Excel data structure (one file per supplier order)
		const excelFiles = generateSupplierOrderExcelData(ordersData);

		console.log('=== SUPPLIER ORDER EXCEL EXPORT DATA ===');
		console.log(`Total Files to Export: ${excelFiles.length}`);
		console.log('');

		excelFiles.forEach((file, index) => {
			console.log(`📄 File ${index + 1}:`);
			console.log(`   Supplier Order Display ID: ${file.displayId}`);
			console.log(`   Supplier: ${file.supplierName}`);
			console.log(`   Số chứng từ: ${file.soChungTu}`);
			console.log(`   Số phiếu nhập: ${file.soPhieuNhap}`);
			console.log(`   Total Items (Rows): ${file.rows.length}`);
			console.log(`   Data:`, file.rows);
			console.log('');
		});

		// Download Excel files
		downloadExcelFiles(excelFiles).then((success) => {
			if (success) {
				console.log('✅ Excel files downloaded successfully!');
				message.success(
					`Đã xuất thành công ${excelFiles.length} file Excel`
				);
			} else {
				console.error(
					'❌ Failed to download Excel files. Make sure xlsx library is installed: yarn add xlsx'
				);
				message.error(
					'Có lỗi xảy ra khi xuất Excel. Vui lòng kiểm tra console.'
				);
			}
		});

		// Clear selection
		onComplete();
	};

	const handleSoChungTuChange = (supplierOrderId: string, value: string) => {
		setSoChungTuValues((prev) => ({
			...prev,
			[supplierOrderId]: value,
		}));
	};

	const handleSoPhieuNhapChange = (supplierOrderId: string, value: string) => {
		setSoPhieuNhapValues((prev) => ({
			...prev,
			[supplierOrderId]: value,
		}));
	};

	return {
		// State
		vatModalVisible,
		exportModalVisible,
		vatRate,
		tiGia,
		soChungTuValues,
		soPhieuNhapValues,
		// Setters
		setVatRate,
		setTiGia,
		// Handlers
		handleOpenExportModal,
		handleVatNext,
		handleVatCancel,
		handleCloseExportModal,
		handleDocumentModalNext,
		handleSoChungTuChange,
		handleSoPhieuNhapChange,
	};
};

