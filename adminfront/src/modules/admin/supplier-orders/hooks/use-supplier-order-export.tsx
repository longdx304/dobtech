import { SupplierOrder } from '@/types/supplier-order';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { generateAmisExcelData, generateSmeExcelData } from '../components/export-excel';
import { downloadExcelFiles } from '../components/export-excel/download';

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

	const [exportTypeModalVisible, setExportTypeModalVisible] = useState<boolean>(false);
	const [pendingExportData, setPendingExportData] = useState<{
		selectedSupplierOrders: SupplierOrder[];
		onComplete: () => void;
	} | null>(null);

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
		// Close document modal and open export type modal
		setExportModalVisible(false);
		setExportTypeModalVisible(true);

		// Save pending data
		setPendingExportData({ selectedSupplierOrders, onComplete });
	};

	const handleExportTypeNext = (type: 'AMIS' | 'SME') => {
		if (!pendingExportData) return;
		const { selectedSupplierOrders, onComplete } = pendingExportData;

		// Prepare data for Excel generation
		const ordersData = selectedSupplierOrders.map((supplierOrder) => ({
			supplierOrder,
			soChungTu: soChungTuValues[supplierOrder.id] || '',
			soPhieuNhap: soPhieuNhapValues[supplierOrder.id] || '',
			vatRate: vatRate,
			tiGia: tiGia,
		}));

		// Generate Excel data structure based on type
		let excelFiles;
		if (type === 'AMIS') {
			excelFiles = generateAmisExcelData(ordersData);
		} else {
			excelFiles = generateSmeExcelData(ordersData);
		}

		console.log(`=== SUPPLIER ORDER EXCEL EXPORT DATA (${type}) ===`);
		console.log(`Total Files to Export: ${excelFiles.length}`);

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

		// Clear selection and state
		setExportTypeModalVisible(false);
		setPendingExportData(null);
		onComplete();
	};

	const handleExportTypeCancel = () => {
		setExportTypeModalVisible(false);
		setExportModalVisible(true);
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
		exportTypeModalVisible,
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
		handleExportTypeNext,
		handleExportTypeCancel,
		handleSoChungTuChange,
		handleSoPhieuNhapChange,
	};
};

