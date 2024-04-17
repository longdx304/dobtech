'use client';

import {
	BadgeDollarSign,
	CandlestickChart,
	Palette,
	Sigma,
	UserRound,
} from 'lucide-react';

import { createProduct, updateProduct } from '@/actions/products';
import { InputWithLabel } from '@/components/Input';
import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { IProductRequest, IProductResponse } from '@/types/products';
import { App, Form, type FormProps } from 'antd';
import _ from 'lodash';

interface Props {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	product: IProductResponse | null;
}

export default function ProductModal({
	state: stateModal,
	handleOk,
	handleCancel,
	product,
}: Props) {
	const [form] = Form.useForm();
	const { message } = App.useApp();

	const onFinish: FormProps<IProductRequest>['onFinish'] = async (values) => {
		console.log('value:', values);

		if (_.isEmpty(product)) {
			await createProduct(values);
			message.success('Thêm sản phẩm thành công');
		} else {
			await updateProduct(product!.id, values);
			message.success('Cập nhật sản phẩm thành công');
		}
		handleCancel();
	};

	const onFinishFailed: FormProps<IProductRequest>['onFinishFailed'] = (
		errorInfo
	) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<SubmitModal
			open={stateModal}
			onOk={handleOk}
			confirmLoading={false}
			handleCancel={handleCancel}
			form={form}
		>
			<Title level={3} className="text-center">{`${
				_.isEmpty(product) ? 'Thêm mới' : 'Cập nhật'
			} sản phẩm`}</Title>
			<Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
				<Form.Item
					name="productName"
					rules={[
						{
							required: true,
							message: 'Tên sản phẩm phải có ít nhất 2 ký tự!',
						},
					]}
					label="Tên sản phẩm:"
					initialValue={product?.title}
				>
					<InputWithLabel placeholder="Tên sản phẩm" prefix={<UserRound />} />
				</Form.Item>
				<Form.Item
					name="colors"
					rules={[
						{ required: true, message: 'Màu sắc phải có ít nhất 2 kí tự' },
					]}
					label="Màu sắc:"
					initialValue={product?.color}
				>
					<InputWithLabel placeholder="Màu sắc" prefix={<Palette />} />
				</Form.Item>
				<Form.Item
					name="quantity"
					rules={[{ required: true, message: 'Số lượng phải lớn hơn 0' }]}
					label="Số lượng:"
					initialValue={product?.quantity}
				>
					<InputWithLabel placeholder="Số lượng sản phẩm" prefix={<Sigma />} />
				</Form.Item>
				<Form.Item
					name="price"
					rules={[
						{ required: true, message: 'Giá tiền phải lớn hơn 1.000 VND' },
					]}
					label="Giá:"
					initialValue={product?.price}
				>
					<InputWithLabel
						placeholder="Giá sản phẩm"
						prefix={<BadgeDollarSign />}
					/>
				</Form.Item>
				<Form.Item
					name="inventoryQuantity"
					rules={[
						{ required: true, message: 'Số lượng tồn kho phải lớn hơn 0' },
					]}
					label="Số lượng tồn kho:"
					initialValue={product?.inventoryQuantity}
				>
					<InputWithLabel
						placeholder="Số lượng tồn kho"
						prefix={<CandlestickChart />}
					/>
				</Form.Item>
			</Form>
		</SubmitModal>
	);
}
