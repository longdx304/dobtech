import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Steps } from '@/components/Steps';
import { Title } from '@/components/Typography';
import { useUser } from '@/lib/providers/user-provider';
import { Supplier, SupplierOrders } from '@/types/supplier';
import { Product } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { FC, useMemo, useState } from 'react';
import ProductForm from './product/product-form';
import SupplierForm from './supplier/supplier-form';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	products: PricedProduct[];
	suppliers: Supplier[];
};

const ITEMS_STEP = [
	{
		title: 'Chọn sản phẩm',
	},
	{
		title: 'Xác nhận thông tin nhà cung cấp',
	},
];

const SupplierOrdersModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	products,
	suppliers,
}) => {
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
		null
	);

	const { user: selectedAdmin } = useUser();

	const onCancel = () => {
		setCurrentStep(0);
		setSelectedProducts([]);
		setSelectedSupplier(null);
		handleCancel();
	};

	const createPayload = () => {
		return {
			products: selectedProducts,
			supplier: selectedSupplier,
			user: selectedAdmin,
		};
	};

	const onSave = async () => {
		const payload = createPayload();

		const supplierOrders: SupplierOrders = {
			id: '1',
			display_id: 0,
			supplier_id: payload?.supplier?.id || '',
			user_id: payload?.user?.id || '',
			cart_id: '1',
			status: 'pending',
			payment_status: 'pending',
			fulfillment_status: 'pending',
			estimated_production_time: '5',
			settlement_time: '5',
			tax_rate: 0,
			metadata: {},
			created_at: '2024-03-15T00:00:00Z',
			updated_at: '2024-03-15T00:00:00Z',
			no_notification: true,
		};
		console.log('supplier orders', supplierOrders);
	};

	const footer = useMemo(() => {
		if (currentStep === 1) {
			return [
				<Button
					key="1"
					type="default"
					onClick={() => {
						setCurrentStep(0);
						setSelectedSupplier(null);
					}}
					// loading={isSubmitting}
					// disabled={isSubmitting}
				>
					Quay lại
				</Button>,
				<Button
					key="2"
					onClick={onSave}
					// loading={isSubmitting}
					// disabled={isSubmitting}
					data-testid="submit-supplier-order"
				>
					Lưu
				</Button>,
			];
		}
		return [];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStep, selectedProducts, selectedSupplier]);

	const handleSupplierForm = (supplier: Supplier) => {
		setSelectedSupplier(supplier);
	};

	return (
		<Modal
			open={state}
			handleOk={handleOk}
			handleCancel={onCancel}
			width={800}
			footer={footer}
		>
			<Title level={3} className="text-center">
				Tạo mới đơn đặt hàng
			</Title>
			<Steps current={currentStep} items={ITEMS_STEP} className="py-4" />
			{currentStep === 0 && (
				<ProductForm
					products={products as Product[]}
					selectedProducts={selectedProducts}
					setSelectedProducts={setSelectedProducts}
					setCurrentStep={setCurrentStep}
					handleCancel={onCancel}
				/>
			)}
			{currentStep === 1 && (
				<SupplierForm
					suppliers={suppliers as Supplier[]}
					onFinish={handleSupplierForm}
				/>
			)}
		</Modal>
	);
};

export default SupplierOrdersModal;
