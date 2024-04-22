'use client';

import {
	BadgeDollarSign,
	CandlestickChart,
	Palette,
	Scale3D,
	Sigma,
	UserRound,
} from 'lucide-react';

import { createProduct, updateProduct } from '@/actions/products';
import { InputWithLabel } from '@/components/Input';
import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { IProductRequest, IProductResponse } from '@/types/products';
import { App, Form, message, type FormProps } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';

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
	const [messageApi, contextHolder] = message.useMessage();

	const titleModal = `${_.isEmpty(product) ? 'Thêm mới' : 'Cập nhật'} sản phẩm`;

	const onFinish: FormProps<IProductRequest>['onFinish'] = async (values) => {
		console.log('value:', values);

		try {
			if (_.isEmpty(product)) {
				console.log('product:', values);
				await createProduct(values);
				message.success('Thêm sản phẩm thành công');
			} else {
				// await updateProduct(
				// 	product!.id,
				// 	'variant_01HW1ZKJ0PJ0Q8E7VFH1PQ67MQ',
				// 	'opt_01HW1ZJ0175GJ4K2JDW50E13SS',
				// 	values
				// );
				// message.success('Cập nhật sản phẩm thành công');
			}
			handleCancel();
		} catch (error: any) {
			messageApi.open({
				type: 'error',
				content: error?.message,
			});
		}
	};

	const onFinishFailed: FormProps<IProductRequest>['onFinishFailed'] = (
		errorInfo
	) => {
		console.log('Failed:', errorInfo);
	};

	useEffect(() => {
		form &&
			form?.setFieldsValue({
				product: product?.title ?? '',
				color: product?.color ?? '',
				quantity: product?.quantity ?? '',
				price: product?.price ?? '',
				inventoryQuantity: product?.inventoryQuantity ?? '',
			});
	}, [product, form]);

	console.log('form');
	return (
		<SubmitModal
			open={stateModal}
			onOk={handleOk}
			confirmLoading={false}
			handleCancel={handleCancel}
			form={form}
		>
			<Title level={3} className="text-center">
				{titleModal}
			</Title>
			<Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
				<Form.Item
					name="title"
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
					name="color"
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
