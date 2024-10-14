import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Steps } from '@/components/Steps';
import { Title } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import Medusa from '@/services/api';
import { LineItemReq, Supplier, SupplierOrdersReq } from '@/types/supplier';
import { User } from '@medusajs/medusa';
import { PDFViewer } from '@react-pdf/renderer';
import { message, Spin } from 'antd';
import {
	useAdminRegion,
	useAdminRegions,
	useAdminVariants,
} from 'medusa-react';
import { FC, useMemo, useState } from 'react';
import { useAdminCreateSupplierOrders } from '../../hooks';
import useSupplierTime from '../../hooks/use-supplier-time';
import OrderPDF, { generatePdfBlob } from './order-pdf';
import ProductTotalForm from './product-total/product-total-form';
import ProductForm from './product/product-form';
import SupplierForm from './supplier/supplier-form';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	suppliers: Supplier[];
};

const ITEMS_STEP = [
	{
		title: 'Chọn sản phẩm',
	},
	{
		title: 'Tổng đơn hàng',
	},
	{
		title: 'Xác nhận thông tin nhà cung cấp',
	},
];

export interface ItemQuantity {
	variantId: string;
	quantity: number;
}

export interface ItemPrice {
	variantId: string;
	unit_price: number;
}

export interface pdfOrderRes {
	lineItems: LineItemReq[];
	supplierId: string;
	userId: string;
	supplier?: Supplier | null;
	user?: User | null;
	email: string;
	countryCode: string;
	estimated_production_time: Date;
	settlement_time: Date;
	metadata?: Record<string, unknown>;
}

const SupplierOrdersModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	suppliers,
}) => {
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
	const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
		null
	);
	const [itemQuantities, setItemQuantities] = useState<ItemQuantity[]>([]);
	const [itemPrices, setItemPrices] = useState<ItemPrice[]>([]);
	const [showPDF, setShowPDF] = useState(false);
	const [pdfOrder, setPdfOrder] = useState<pdfOrderRes | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createSupplierOrder = useAdminCreateSupplierOrders();
	const { regions } = useAdminRegions();
	const [regionId, setRegionId] = useState<string | null>(null);

	const { region } = useAdminRegion(regionId || '');

	// supplier date time picker
	const {
		supplierDates,
		handleSettlementDateChange,
		handleProductionDateChange,
		updateDatesFromSupplier,
	} = useSupplierTime();

	const { user: selectedAdmin } = useUser();

	const { variants } = useAdminVariants({
		id: selectedProducts,
		limit: 100,
	});

	const onCancel = () => {
		setCurrentStep(0);
		setSelectedProducts([]);
		setSelectedSupplier(null);
		handleCancel();
	};

	const createPayload = () => {
		const lineItems: LineItemReq[] = itemQuantities.map((item) => {
			const priceItem = itemPrices.find(
				(price) => price.variantId === item.variantId
			);
			return {
				variantId: item.variantId,
				quantity: item.quantity,
				unit_price: priceItem ? priceItem.unit_price : undefined,
			};
		});
		return {
			lineItems: lineItems,
			products: selectedProducts,
			supplier: selectedSupplier,
			user: selectedAdmin,
		};
	};

	const onSaveOrder = async () => {
		const payload = createPayload();
		const productionDate = supplierDates.productionDate?.toDate();
		const settlementDate = supplierDates.settlementDate?.toDate();

		const supplierOrdersDraft: pdfOrderRes = {
			lineItems: payload?.lineItems || [],
			supplierId: payload?.supplier?.id || '',
			supplier: payload?.supplier,
			userId: payload?.user?.id || '',
			user: payload?.user as any,
			email: payload?.user?.email || '',
			estimated_production_time: productionDate || new Date(),
			settlement_time: settlementDate || new Date(),
			countryCode: region?.countries[0].iso_2 || 'vn',
		};

		setPdfOrder(supplierOrdersDraft);
		setShowPDF(true);
	};

	const onSubmitOrder = async () => {
		setIsSubmitting(true);

		try {
			// Generate pdf blob
			const pdfBlob = await generatePdfBlob(pdfOrder!, variants);

			// Create a File object
			const fileName = `purchase-order.pdf`;

			// Create a File object
			const file = new File([pdfBlob], fileName, {
				type: 'application/pdf',
			});

			// Upload pdf to s3 using Medusa uploads API
			// const uploadRes = await Medusa.uploads.create([file]);

			// const pdfUrl = (uploadRes.data as any).uploads[0].url;
			const pdfUrl =
				'https://dob-ecommerce.s3.ap-southeast-1.amazonaws.com/purchase-order-1728871955540.pdf';

			const orderPayload: SupplierOrdersReq = {
				lineItems: pdfOrder?.lineItems || [],
				supplierId: pdfOrder?.supplier?.id || '',
				userId: pdfOrder?.user?.id || '',
				email: pdfOrder?.user?.email || '',
				estimated_production_time:
					supplierDates.productionDate?.toDate() || new Date(),
				settlement_time: supplierDates.settlementDate?.toDate() || new Date(),
				countryCode: region?.countries[0]?.iso_2 || 'vn',
				region_id: region?.id || '',
				currency_code: region?.currency_code || 'vnd',
				document_url: pdfUrl,
			};

			await createSupplierOrder.mutateAsync(orderPayload as any);

			message.success('Đơn hàng đã đặt và gửi cho nhà cung cấp thành công!');
			setShowPDF(false);
			handleCancel();
		} catch (error) {
			console.error('Error submitting order:', error);
			message.error('Đơn đặt đơn đặt thất bại! Vui lòng thử lại.');
		} finally {
			setIsSubmitting(false);
		}
	};

	console.log('region', region);

	// footer
	const footer = useMemo(() => {
		if (currentStep === 2) {
			return [
				<Button
					key="1"
					type="default"
					onClick={() => {
						setCurrentStep(0);
						setSelectedSupplier(null);
						setSelectedProducts([]);
						setItemQuantities([]);
						setItemPrices([]);
						setRegionId(null);
					}}
				>
					Quay lại
				</Button>,
				<Button
					key="2"
					onClick={onSaveOrder}
					data-testid="submit-supplier-order"
				>
					Kiểm tra đơn đặt hàng
				</Button>,
			];
		}
		return [];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStep, selectedProducts, selectedSupplier, supplierDates]);

	// handle supplier form
	const handleSupplierForm = (supplier: Supplier | null) => {
		setSelectedSupplier(supplier);
		updateDatesFromSupplier(supplier);
	};

	return (
		<>
			<Modal
				open={state}
				handleOk={handleOk}
				handleCancel={onCancel}
				width={800}
				footer={footer}
				maskClosable={false}
			>
				<Title level={3} className="text-center">
					Tạo mới đơn đặt hàng
				</Title>
				<Steps current={currentStep} items={ITEMS_STEP} className="py-4" />
				{currentStep === 0 && (
					<ProductForm
						selectedProducts={selectedProducts}
						setSelectedProducts={setSelectedProducts}
						setCurrentStep={setCurrentStep}
						handleCancel={onCancel}
						itemQuantities={itemQuantities}
						setItemQuantities={setItemQuantities}
						itemPrices={itemPrices}
						setItemPrices={setItemPrices}
						regions={regions}
						regionId={regionId}
						setRegionId={setRegionId}
					/>
				)}
				{currentStep === 1 && (
					<ProductTotalForm
						selectedProducts={selectedProducts}
						itemQuantities={itemQuantities}
						itemPrices={itemPrices}
						setCurrentStep={setCurrentStep}
						regionId={regionId}
					/>
				)}
				{currentStep === 2 && (
					<SupplierForm
						suppliers={suppliers as Supplier[]}
						selectedSupplier={selectedSupplier}
						setSelectedSupplier={handleSupplierForm}
						supplierDates={supplierDates}
						handleSettlementDateChange={handleSettlementDateChange}
						handleProductionDateChange={handleProductionDateChange}
						updateDatesFromSupplier={updateDatesFromSupplier}
					/>
				)}
			</Modal>

			{/* show the contract pdf  */}
			{showPDF && pdfOrder && (
				<Modal
					open={showPDF}
					handleOk={() => setShowPDF(false)}
					handleCancel={() => setShowPDF(false)}
					width={850}
					footer={[
						<Button
							key="close"
							onClick={() => setShowPDF(false)}
							type="default"
						>
							Thoát
						</Button>,
						<Button key="submit" type="primary" onClick={onSubmitOrder}>
							Tạo đơn đặt hàng
						</Button>,
					]}
					loading={isSubmitting}
				>
					<PDFViewer width="100%" height="600px">
						<OrderPDF order={pdfOrder} variants={variants} region={region} />
					</PDFViewer>
				</Modal>
			)}

			{/* show loading when submitting pdf */}
			<Spin spinning={isSubmitting} />
		</>
	);
};

export default SupplierOrdersModal;
