'use client';

import React, { useEffect, useState } from 'react';
import { ProductCategory } from '@medusajs/medusa';
import { Form, type FormProps, App, Col, Row } from 'antd';
import _ from 'lodash';
import { Highlighter } from 'lucide-react';

import { SubmitModal } from '@/components/Modal';
import { Input, TextArea } from '@/components/Input';
import { Title } from '@/components/Typography';
import { createCategory, updateCategory } from '@/actions/productCategories';
import { TCategoryRequest } from '@/types/productCategories';
import { Select } from '@/components/Select';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useMemo } from 'react';

interface Props {
	stateModal: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	category: ProductCategory | null;
	parentCategory: ProductCategory | null;
	categories: ProductCategory[];
}
const CategoryModal: React.FC<Props> = ({
	stateModal,
	handleOk,
	handleCancel,
	category,
	parentCategory,
	categories,
}) => {
	const [form] = Form.useForm();
	const { message } = App.useApp();

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
	const getAncestors = (targetNode, nodes, acc = []) => {
		let parentCategory = null;

		acc.push(targetNode);

		if (targetNode.parent_category_id) {
			parentCategory = nodes.find(
				(n) => n.id === targetNode.parent_category_id
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
		_.isEmpty(category) && newResult.push({ title: 'Danh mục mới' });
		return newResult;
	}, [parentCategory, categories]);

	// Submit form
	const onFinish: FormProps<TCategoryRequest>['onFinish'] = async (values) => {
		try {
			// Create user
			if (_.isEmpty(category)) {
				const payload = {
					...values,
					parent_category_id: parentCategory?.id ?? null,
				};
				const result = await createCategory(payload);
				message.success('Đăng ký danh mục sản phẩm thành công');
			} else {
				// Update user
				const result = await updateCategory(category.id, values);
				message.success('Cập nhật danh mục sản phẩm thành công');
			}
			handleCancel();
		} catch (error: any) {
			message.error(error?.message);
		}
	};

	return (
		<SubmitModal
			open={stateModal}
			onOk={handleOk}
			confirmLoading={false}
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
									{ value: true, label: 'Hoạt động' },
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
									{ value: false, label: 'Công khai' },
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
