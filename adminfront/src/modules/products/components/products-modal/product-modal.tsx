'use client';

import {
	BadgeDollarSign,
	CandlestickChart,
	Layers,
	Palette,
	Sigma,
	UserRound,
} from 'lucide-react';

import { createProduct, updateProduct } from '@/actions/products';
import { Input } from '@/components/Input';
import InputNumber from '@/components/Input/InputNumber';
import { SubmitModal } from '@/components/Modal';
import { Select, TreeSelect } from '@/components/Select';
import { Title } from '@/components/Typography';
import { IProductRequest, IProductResponse } from '@/types/products';
import { Form, message, type FormProps } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';

interface Props {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	product: IProductResponse | null;
	productCategories: any;
}

export default function ProductModal({
	state: stateModal,
	handleOk,
	handleCancel,
	product,
	productCategories,
}: Props) {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();

	const titleModal = `${_.isEmpty(product) ? 'Thêm mới' : 'Cập nhật'} sản phẩm`;

	// set form values when product is loaded
	useEffect(() => {
		const selectedSizes = product?.options.find(
			(option) => option.title === 'Size'
		)?.values;

		const selectedVariantIds = selectedSizes?.map(
			(size: any) =>
				product?.options
					.find((option) => option.title === 'Size')
					?.values.find((value) => value.value === size)?.variant_id
		);

		const selectedOptions = product?.options
			.filter((option) => ['Color', 'Quantity'].includes(option.title))
			.map((option) => ({
				...option,
				values: option.values.find((value) =>
					selectedVariantIds?.includes(value.variant_id)
				),
			}));

		const selectedVariants = product?.variants.filter((variant) =>
			selectedVariantIds?.includes(variant.id)
		);

		form &&
			form?.setFieldsValue({
				title: product?.title ?? '',
				categories: product?.categories?.map((category) => category.id) ?? [],
				sizes: [],

				color:
					selectedOptions?.find((option) => option.title === 'Color')?.values
						?.value ?? '',

				quantity:
					selectedOptions?.find((option) => option.title === 'Quantity')?.values
						?.value ?? '',

				price:
					selectedVariants
						?.map((variant) => variant.prices[0].amount)
						.toString() ?? [],

				inventoryQuantity:
					selectedVariants?.map((variant) => variant.inventory_quantity) ?? [],
			});
	}, [product, form]);
	console.log('product', product);

	// handle form submit
	const onFinish: FormProps<IProductRequest>['onFinish'] = async (values) => {
		try {
			if (_.isEmpty(product)) {
				await createProduct(values);
				message.success('Thêm sản phẩm thành công');
			} else {
				await updateProduct(
					product!.id,
					product.variants ?? [],
					product.options ?? [],
					values
				);

				message.success('Cập nhật sản phẩm thành công');
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

	// recursive function to convert categories to tree data
	const convertCategoriesToTreeData = (categories: any) => {
		return categories.map((category: any) => {
			const { id, name, category_children } = category;
			const children =
				category_children.length > 0
					? convertCategoriesToTreeData(category_children)
					: [];

			return {
				title: name,
				value: id,
				id: id,
				children,
			};
		});
	};

	const treeData = convertCategoriesToTreeData(productCategories);

	const [categoryValue, setCategoryValue] = useState<any>([]);

	const onChange = (newValue: string[]) => {
		// const selectedCategories = newValue.map((value: string) =>
		// 	productCategories.find((category: any) => category.id === value)
		// );

		setCategoryValue(newValue);
	};

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
			<Form
				form={form}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				className="pt-3"
			>
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
					<Input
						placeholder="Tên sản phẩm"
						prefix={<Layers />}
						data-testid="title"
					/>
				</Form.Item>
				<Form.Item
					name="categories"
					label="Danh mục:"
					rules={[
						{
							required: true,
							message: 'Phải chọn ít nhất một danh mục!',
						},
					]}
				>
					<TreeSelect
						title="Chọn danh mục"
						treeData={treeData}
						onChange={onChange}
						value={categoryValue}
					/>
				</Form.Item>
				<Form.Item
					name="sizes"
					rules={[{ required: true, message: 'Hãy chọn kích thước phù hợp' }]}
					label="Kích thước:"
				>
					<Select
						mode="tags"
						placeholder="Chọn hoặc nhập kích thước"
						style={{ width: '100%' }}
						tokenSeparators={[',']}
						data-testid="sizes"
						options={
							(product &&
								product?.options.find((option) => option.title === 'Size')
									?.values) ||
							undefined
						}
						onChange={(selectedSizes) => {
							const selectedVariantIds = selectedSizes.map(
								(size: any) =>
									product?.options
										.find((option) => option.title === 'Size')
										?.values.find((value) => value.value === size)?.variant_id
							);

							const selectedOptions = product?.options
								.filter((option) =>
									['Color', 'Quantity'].includes(option.title)
								)
								.map((option) => ({
									...option,
									values: option.values.find((value) =>
										selectedVariantIds.includes(value.variant_id)
									),
								}));

							const selectedVariants = product?.variants.filter((variant) =>
								selectedVariantIds.includes(variant.id)
							);

							const valuesToSet = {
								sizes: selectedSizes,

								color: selectedOptions?.find(
									(option) => option.title === 'Color'
								)?.values?.value,

								quantity: selectedOptions?.find(
									(option) => option.title === 'Quantity'
								)?.values?.value,

								price: selectedVariants?.map(
									(variant) => variant.prices[0].amount
								),

								inventoryQuantity: selectedVariants?.map(
									(variant) => variant.inventory_quantity
								),
							};

							product && form.setFieldsValue(valuesToSet);
						}}
					/>
				</Form.Item>
				<Form.Item
					name="color"
					rules={[
						{ required: true, message: 'Màu sắc phải có ít nhất 2 kí tự' },
					]}
					label="Màu sắc:"
					// initialValue={
					// 	product?.options.find((option) => option.title === 'Color')?.values
					// }
				>
					<Input
						placeholder="Màu sắc"
						prefix={<Palette />}
						data-testid="color"
					/>
				</Form.Item>
				<Form.Item
					name="quantity"
					rules={[{ required: true, message: 'Số lượng phải lớn hơn 0' }]}
					label="Số lượng:"
					// initialValue={
					// 	product?.options.find((option) => option.title === 'Quantity')
					// 		?.values
					// }
				>
					<Input
						placeholder="Số lượng sản phẩm"
						prefix={<Sigma />}
						data-testid="quantity"
					/>
				</Form.Item>
				<Form.Item
					name="price"
					rules={[
						{ required: true, message: 'Giá tiền phải lớn hơn 1.000 VND' },
					]}
					label="Giá:"
					// initialValue={product?.variants?.map(
					// 	(variant) => variant.prices[0].amount
					// )}
				>
					<InputNumber
						placeholder="Giá sản phẩm"
						prefix={<BadgeDollarSign />}
						data-testid="price"
					/>
				</Form.Item>
				<Form.Item
					name="inventoryQuantity"
					rules={[
						{ required: true, message: 'Số lượng tồn kho phải lớn hơn 0' },
					]}
					label="Số lượng tồn kho:"
					// initialValue={product?.variants.map(
					// 	(variant) => variant.inventory_quantity
					// )}
				>
					<InputNumber
						placeholder="Số lượng tồn kho"
						prefix={<CandlestickChart />}
						data-testid="inventoryQuantity"
					/>
				</Form.Item>
			</Form>
		</SubmitModal>
	);
}
