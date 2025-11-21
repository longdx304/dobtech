'use client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import { Order } from '@medusajs/medusa';
import { FC } from 'react';

interface ExportModalsProps {
	// VAT Modal
	vatModalVisible: boolean;
	vatRate: number;
	onVatRateChange: (value: number) => void;
	onVatNext: () => void;
	onVatCancel: () => void;

	// Document Modal
	exportModalVisible: boolean;
	selectedOrders: Order[];
	soChungTuValues: Record<string, string>;
	soPhieuXuatValues: Record<string, string>;
	onSoChungTuChange: (orderId: string, value: string) => void;
	onSoPhieuXuatChange: (orderId: string, value: string) => void;
	onDocumentNext: () => void;
	onDocumentCancel: () => void;
}

const ExportModals: FC<ExportModalsProps> = ({
	vatModalVisible,
	vatRate,
	onVatRateChange,
	onVatNext,
	onVatCancel,
	exportModalVisible,
	selectedOrders,
	soChungTuValues,
	soPhieuXuatValues,
	onSoChungTuChange,
	onSoPhieuXuatChange,
	onDocumentNext,
	onDocumentCancel,
}) => {
	return (
		<>
			{/* Step 1: VAT Modal */}
			<Modal
				open={vatModalVisible}
				title="Nhập thuế GTGT"
				handleOk={onVatNext}
				handleCancel={onVatCancel}
				width={400}
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
					<Text>Nhập thuế suất GTGT (%) cho các đơn hàng:</Text>
					<Input
						type="number"
						placeholder="Nhập thuế suất (ví dụ: 8)"
						value={vatRate}
						onChange={(e) => onVatRateChange(Number(e.target.value))}
						suffix="%"
					/>
				</div>
			</Modal>

			{/* Step 2: Document Modal */}
			<Modal
				open={exportModalVisible}
				title="Xuất đơn hàng (Bước 2/2)"
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
					{selectedOrders.map(order => (
						<div key={order.id} className="flex flex-col gap-2 pb-3 border-b">
							<Text className="font-medium">Đơn hàng số {order.display_id}</Text>
							<Input
								placeholder="Nhập số chứng từ..."
								value={soChungTuValues[order.id] || ''}
								onChange={(e) => onSoChungTuChange(order.id, e.target.value)}
							/>
							<Input
								placeholder="Nhập số phiếu xuất kho..."
								value={soPhieuXuatValues[order.id] || ''}
								onChange={(e) => onSoPhieuXuatChange(order.id, e.target.value)}
							/>
						</div>
					))}
				</div>
			</Modal>
		</>
	);
};

export default ExportModals;

