'use client';

import { AdminPostProductCategoriesReq, ProductCategory } from '@medusajs/medusa';
import { App, Col, Form, Row, message, type FormProps } from 'antd';
import _ from 'lodash';
import { Highlighter } from 'lucide-react';
import React, { useEffect } from 'react';
import {
	useAdminCreateProductCategory,
	useAdminUpdateProductCategory,
} from 'medusa-react';

// import { createCategory, updateCategory } from '@/actions/productCategories';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Input, TextArea } from '@/components/Input';
import { SubmitModal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Title } from '@/components/Typography';
import { TCategoryRequest } from '@/types/productCategories';
import { useMemo } from 'react';

interface Props {
	stateModal: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	category: ProductCategory | null;
	parentCategory: ProductCategory | null;
	categories: ProductCategory[];
	refetch: () => void;
}
const CategoryModal: React.FC<Props> = ({
	stateModal,
	handleOk,
	handleCancel,
	category,
	parentCategory,
	categories,
	refetch,
}) => {
	const createCategory = useAdminCreateProductCategory();
	const updateCategory = useAdminUpdateProductCategory(category?.id ?? '');
	const [form] = Form.useForm();
	// const { message } = App.useApp();

	const titleModal = `${
		_.isEmpty(category) ? 'Thêm mới' : 'Cập nhật'
	} danh mục sản phẩm`;

	useEffect(() => {
		form &&
			form?.setFieldsValue({
				name: category?.name ?? '',
				description: category?.description ?? '',
				is_active: category?.is_active ?? true,
				is_internal: category?.is_internal ?? false,
			});
	}, [category, form]);

	// Get tree category
	const getAncestors = (targetNode: any, nodes: any, acc = []) => {
		let parentCategory = null;

		acc.push(targetNode as never);

		if (targetNode.parent_category_id) {
			parentCategory = nodes.find(
				(n: any) => n.id === targetNode.parent_category_id
			);

			acc = getAncestors(parentCategory, nodes, acc);
		}

		if (!parentCategory) {
			return acc.reverse();
		}

		return acc;
	};

	// Show list ancestors to Breadcrumb
	const ancestors = useMemo(() => {
		const result = parentCategory && getAncestors(parentCategory, categories);
		if (_.isEmpty(result)) return [];
		const newResult = result?.map((item: ProductCategory) => ({
			title: item.name,
		}));

		if (_.isEmpty(category) && newResult) {
			newResult.push({ title: 'Danh mục mới' });
		}

		return newResult;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parentCategory, categories]);

	// Submit form
	const onFinish: FormProps<TCategoryRequest>['onFinish'] = async (values) => {
		// Create user
		if (_.isEmpty(category)) {
			const payload: Record<string, unknown> = {
				...values,
				parent_category_id: parentCategory?.id ?? null,
			};
			// const result = await createCategory(payload);
			await createCategory.mutateAsync(payload as any, {
				onSuccess: () => {
					message.success('Đăng ký danh mục sản phẩm thành công');
					refetch();
					handleCancel();
				},
				onError: () => {
					message.error('Đăng ký danh mục sản phẩm thất bại');
				},
			});
		} else {
			// Update user
			// const result = await updateCategory(category.id, values);
			updateCategory.mutateAsync(values as any, {
				onSuccess: () => {
					message.success('Cập nhật danh mục sản phẩm thành công');
					handleCancel();
				},
				onError: () => {
					message.error('Cập nhật danh mục sản phẩm thất bại');
				},
			});
		}
	};

	return (
		<SubmitModal
			open={stateModal}
			onOk={handleOk}
			isLoading={createCategory?.isLoading || updateCategory?.isLoading}
			handleCancel={handleCancel}
			form={form}
		>
			<Title level={3} className="text-center pb-2">
				{titleModal}
			</Title>
			{!_.isEmpty(ancestors) && (
				<div className="py-2" data-testid="breadcrumbCategory">
					<Breadcrumb items={ancestors} />
				</div>
			)}
			<Form
				id="form-category"
				form={form}
				onFinish={onFinish}
				// onFinishFailed={onFinishFailed}
			>
				<Form.Item
					labelCol={{ span: 24 }}
					name="name"
					rules={[{ required: true, message: 'Tên không đúng định dạng' }]}
					label="Tên danh mục:"
				>
					<Input
						placeholder="Đặt tên cho danh mục này"
						prefix={<Highlighter />}
						data-testid="name"
					/>
				</Form.Item>
				<Form.Item
					labelCol={{ span: 24 }}
					name="description"
					// rules={[{ required: true, message: 'Tên phải có ít nhất 2 ký tự!' }]}
					label="Mô tả:"
				>
					<TextArea
						placeholder="Đặt mô tả cho danh mục này"
						data-testid="description"
					/>
				</Form.Item>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<Form.Item
							labelCol={{ span: 24 }}
							name="is_active"
							// rules={[{ required: true, message: 'Tên phải có ít nhất 2 ký tự!' }]}
							label="Trạng thái:"
						>
							<Select
								data-testid="is_active"
								options={[
									{ value: true as any, label: 'Hoạt động' },
									{ value: false, label: 'Không hoạt động' },
								]}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							labelCol={{ span: 24 }}
							name="is_internal"
							// rules={[{ required: true, message: 'Tên phải có ít nhất 2 ký tự!' }]}
							label="Quyền riêng tư:"
						>
							<Select
								data-testid="is_internal"
								options={[
									{ value: false as any, label: 'Công khai' },
									{ value: true, label: 'Không công khai' },
								]}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</SubmitModal>
	);
};

export default CategoryModal;
