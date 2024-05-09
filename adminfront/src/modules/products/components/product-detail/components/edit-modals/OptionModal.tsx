import { FC, useEffect, useMemo } from 'react';
import { Form, message, typeFormProps, Row, Col } from 'antd';
import { Product } from '@medusajs/client-types';
import { CircleAlert, Plus, Trash2 } from 'lucide-react';

import { SubmitModal } from '@/components/Modal';
import { Title, Text } from '@/components/Typography';
import { Flex } from '@/components/Flex';
import { TooltipIcon } from '@/components/Tooltip';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';

type Props = {
	product?: Product;
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};

const OptionModal: FC<Props> = ({ state, product, handleOk, handleCancel }) => {
	const [form] = Form.useForm();
	const onCancel = () => {
		handleCancel();
	};

	const onFinish: FormProps<any>['onFinish'] = async (values) => {
		console.log(values);

		// handleOk();
	};

	useEffect(() => {
		if (product) {
			const options = product.options.map((option) => ({
				title: option.title,
				// options: option.values,
				initValues: option.values,
			}));
			form.setFieldsValue({
				options: options,
			});
		}
	}, [form]);
	return (
		<SubmitModal
			open={state}
			onOk={handleOk}
			// isLoading={isLoading}
			handleCancel={onCancel}
			width={800}
			form={form}
		>
			<Title level={3} className="text-center">
				{`Chỉnh sửa tuỳ chọn`}
			</Title>
			<Form
				form={form}
				onFinish={onFinish}
				className="pt-3"
				// initialValues={getDefaultValues(thumbnail)}
			>
				<OptionForm form={form} />
			</Form>
		</SubmitModal>
	);
};

export default OptionModal;

type OptionFormProps = {
	form: any;
};

const OptionForm = ({ form }) => {

	const checkDuplicate = (_, value) => {
		console.log('validate',value)
		if (!value || value.length === 0) {
			return Promise.resolve();
		}
		
		const valueSet = new Set(value);
		if (valueSet.size !== value.length) {
			return Promise.reject(new Error('Các giá trị không được trùng lặp'));
		}
		
		return Promise.resolve();
	};


	return (
		<Flex vertical>
			<Flex gap="4px" className="pb-2" align="center">
				<Text className="text-sm text-gray-500 font-medium">
					Tuỳ chọn sản phẩm
				</Text>
				<TooltipIcon
					title="Tuỳ chọn được sử dụng để xác định màu sắc, kích thước, v.v của sản phẩm."
					icon={<CircleAlert className="w-[16px] stroke-2" color="#E7B008" />}
				/>
			</Flex>
			<Form.List name="options">
				{(fields, { add, remove }, { errors }) => (
					<Flex vertical gap="small" className="w-full">
						{fields.length > 0 && (
							<Row gutter={[16, 16]} wrap={false}>
								<Col span={6}>
									<Text className="text-sm text-gray-500 font-medium">
										Tiêu đề tuỳ chọn
									</Text>
								</Col>
								<Col span={6}>
									<Flex gap="4px" align="center">
										<Text className="text-sm text-gray-500 font-medium">
											Biến thể
										</Text>
										<TooltipIcon
											title="Biến thể đã được thêm vào sản phẩm. Không thể xoá ở đây."
											icon={
												<CircleAlert
													className="w-[16px] stroke-2 text-gray-500"
												/>
											}
										/>
									</Flex>
								</Col>
								<Col flex="auto">
									<Text className="text-sm text-gray-500 font-medium">
										Biến thể (phân tách bằng dấu phẩy)
									</Text>
								</Col>
								<Col flex="40px"></Col>
							</Row>
						)}
						{fields.map((field, index) => (
							<Row key={field.key} gutter={[16, 16]} wrap={false}>
								<Col span={6}>
									<Form.Item
										{...field}
										rules={[
											{
												required: true,
												whitespace: true,
												message: 'Vui lòng nhập tiêu đề hoặc xoá trường này',
											},
										]}
										labelCol={{ span: 24 }}
										name={[field.name, 'title']}
										initialValue=""
										className="mb-0 text-xs"
									>
										<Input placeholder="Màu sắc, Kích thước..." />
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										{...field}
										rules={[
											{
												required: true,
												type: 'array',
												message: 'Vui lòng nhập tiêu đề hoặc xoá trường này',
											},
										]}
										labelCol={{ span: 24 }}
										name={[field.name, 'initValues']}
										className="mb-0 text-xs"
										initialValue={[]}
									>
										<Select
											size="large"
											mode="tags"
											placeholder="Xanh, Đỏ, Đen, S, M, L..."
											style={{ width: '100%' }}
											tokenSeparators={[',']}
											disabled
										/>
									</Form.Item>
								</Col>
								<Col flex="auto">
									<Form.Item
										{...field}
										rules={[
											{
												required: true,
												type: 'array',
												message: 'Vui lòng nhập tiêu đề hoặc xoá trường này',
											},
											{ validator: checkDuplicate },
										]}
										labelCol={{ span: 24 }}
										name={[field.name, 'values']}
										className="mb-0 text-xs"
										initialValue={[]}
									>
										<Select
											size="large"
											mode="tags"
											placeholder="Xanh, Đỏ, Đen, S, M, L..."
											style={{ width: '100%' }}
											tokenSeparators={[',']}
										/>
									</Form.Item>
								</Col>
								<Col flex="40px">
									{fields.length > 0 ? (
										<div className="h-full">
											<Button
												type="text"
												danger
												icon={<Trash2 size={18} className="stroke-2" />}
												onClick={() => remove(field.name)}
												className="h-[46px]"
											/>
										</div>
									) : null}
								</Col>
							</Row>
						))}
						<div span={24} className="w-full">
							<Form.Item>
								<Button
									type="default"
									className="w-full flex justify-center items-center"
									icon={<Plus size={20} className="stroke-2" />}
									onClick={() => add()}
								>
									Thêm một tuỳ chọn
								</Button>
							</Form.Item>
						</div>
					</Flex>
				)}
			</Form.List>
		</Flex>
	);
};
