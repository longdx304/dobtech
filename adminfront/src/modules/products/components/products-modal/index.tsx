'use client';
import {
  BadgeDollarSign,
  CandlestickChart,
  Palette,
  Sigma,
  UserRound
} from 'lucide-react';
import { useFormState } from 'react-dom';

import { InputWithLabel } from '@/components/Input';
import { SubmitModal } from '@/components/Modal';
import { ErrorText, Title } from '@/components/Typography';
import { createProduct } from '@/services/products';

interface Props {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
}

const ProductModal = ({ state: stateModal, handleOk, handleCancel }: Props) => {
	const [state, formAction] = useFormState(createProduct, null);

	return (
		<SubmitModal
			open={stateModal}
			onOk={handleOk}
			confirmLoading={false}
			handleCancel={handleCancel}
			formAction={formAction}
		>
			<Title level={3} className="text-center">{`Thêm sản phẩm`}</Title>
			<InputWithLabel
				name="productName"
				label="Tên sản phẩm"
				placeholder="Nhập tên sản phẩm"
				prefix={<UserRound />}
				error={state?.productName}
			/>
			<InputWithLabel
				name="colors"
				label="Màu sắc"
				placeholder="Nhập màu sắc sản phẩm"
				prefix={<Palette />}
				error={state?.colors}
			/>
			<InputWithLabel
				name="quantity"
				label="Số lượng"
				placeholder="Nhập số lượng sản phẩm"
				prefix={<Sigma />}
				error={state?.quantity}
			/>
			<InputWithLabel
				name="price"
				label="Giá"
				placeholder="Nhập giá sản phẩm"
				prefix={<BadgeDollarSign />}
				error={state?.price}
			/>
			<InputWithLabel
				name="inventoryQuantity"
				label="Số lượng tồn kho"
				placeholder="Nhập số lượng tồn kho sản phẩm"
				prefix={<CandlestickChart />}
				error={state?.inventoryQuantity}
			/>
		</SubmitModal>
	);
};

export default ProductModal;
