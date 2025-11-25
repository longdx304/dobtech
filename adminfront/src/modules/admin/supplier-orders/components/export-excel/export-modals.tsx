'use client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import { SupplierOrder } from '@/types/supplier-order';
import { FC } from 'react';

interface ExportModalsProps {
	// VAT Modal
	vatModalVisible: boolean;
	vatRate: number;
	tiGia: number;
	onVatRateChange: (value: number) => void;
	onTiGiaChange: (value: number) => void;
	onVatNext: () => void;
	onVatCancel: () => void;

	// Document Modal
	exportModalVisible: boolean;
	selectedSupplierOrders: SupplierOrder[];
	soChungTuValues: Record<string, string>;
	soPhieuNhapValues: Record<string, string>;
	onSoChungTuChange: (supplierOrderId: string, value: string) => void;
	onSoPhieuNhapChange: (supplierOrderId: string, value: string) => void;
	onDocumentNext: () => void;
	onDocumentCancel: () => void;
}

const ExportModals: FC<ExportModalsProps> = ({
	vatModalVisible,
	vatRate,
	tiGia,
	onVatRateChange,
	onTiGiaChange,
	onVatNext,
	onVatCancel,
	exportModalVisible,
	selectedSupplierOrders,
	soChungTuValues,
	soPhieuNhapValues,
	onSoChungTuChange,
	onSoPhieuNhapChange,
	onDocumentNext,
	onDocumentCancel,
}) => {
	return (
		<>
			{/* Step 1: VAT and Exchange Rate Modal */}
			<Modal
				open={vatModalVisible}
				title="Nhập thông tin thuế và tỷ giá"
				handleOk={onVatNext}
				handleCancel={onVatCancel}
				width={450}
				footer={[
					<Button key="cancel" type="default" danger onClick={onVatCancel}>
						Huỷ
					</Button>,
					<Button key="next" onClick={onVatNext}>
						Tiếp theo
					</Button>,
				]}
			>
				<div className="flex flex-col gap-4">
					<div>
						<Text className="font-medium mb-2 block">
							Thuế suất GTGT (%)
						</Text>
						<Input
							type="number"
							placeholder="Nhập thuế suất (ví dụ: 8)"
							value={vatRate}
							onChange={(e) => onVatRateChange(Number(e.target.value))}
							suffix="%"
						/>
					</div>
					<div>
						<Text className="font-medium mb-2 block">Tỷ giá</Text>
						<Input
							type="number"
							placeholder="Nhập tỷ giá (ví dụ: 1)"
							value={tiGia}
							onChange={(e) => onTiGiaChange(Number(e.target.value))}
							step="0.01"
						/>
						<Text className="text-xs text-gray-500 mt-1">
							Tỷ giá quy đổi từ ngoại tệ sang VND
						</Text>
					</div>
				</div>
			</Modal>

			{/* Step 2: Document Modal */}
			<Modal
				open={exportModalVisible}
				title="Xuất đơn mua hàng (Bước 2/2)"
				handleOk={onDocumentNext}
				handleCancel={onDocumentCancel}
				width={600}
				footer={[
					<Button key="cancel" type="default" danger onClick={onDocumentCancel}>
						Hủy
					</Button>,
					<Button key="next" type="primary" onClick={onDocumentNext}>
						Xuất Excel
					</Button>,
				]}
			>
				<div className="space-y-4">
					{selectedSupplierOrders.map((supplierOrder) => (
						<div
							key={supplierOrder.id}
							className="flex flex-col gap-2 pb-3 border-b"
						>
							<Text className="font-medium">
								Đơn mua hàng số {supplierOrder.display_id}
							</Text>
							<Input
								placeholder="Nhập số chứng từ..."
								value={soChungTuValues[supplierOrder.id] || ''}
								onChange={(e) =>
									onSoChungTuChange(supplierOrder.id, e.target.value)
								}
							/>
							<Input
								placeholder="Nhập số phiếu nhập kho..."
								value={soPhieuNhapValues[supplierOrder.id] || ''}
								onChange={(e) =>
									onSoPhieuNhapChange(supplierOrder.id, e.target.value)
								}
							/>
						</div>
					))}
				</div>
			</Modal>
		</>
	);
};

export default ExportModals;

