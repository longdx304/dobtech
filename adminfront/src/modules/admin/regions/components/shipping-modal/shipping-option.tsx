import { Input, InputNumber } from '@/components/Input';
import { SubmitModal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { Text } from '@/components/Typography';
import { getErrorMessage } from '@/lib/utils';
import { AdminPostShippingOptionsReq, ShippingOption } from '@medusajs/medusa';
import { Alert, Col, Divider, Form, message, Row } from 'antd';
import _ from 'lodash';
import {
	useAdminCreateShippingOption,
	useAdminUpdateShippingOption,
} from 'medusa-react';
import { FC, useEffect, useState } from 'react';
import { useShippingOptionFormData } from './use-shipping-option-form-data';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	regionId: string;
	shippingOption?: ShippingOption;
};

const ShippingOptionModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	regionId,
	shippingOption,
}) => {
	const [form] = Form.useForm();
	const [visibleInStore, setVisibleInStore] = useState(false);
	const automaticPolicy = Form.useWatch('automatic_policy', form);
	const createShippingOption = useAdminCreateShippingOption();
	const updateShippingOption = useAdminUpdateShippingOption(
		shippingOption?.id || ''
	);

	const { getShippingOptionData, getRequirementsData } =
		useShippingOptionFormData(regionId || '');

	const createPayload = (values: AdminPostShippingOptionsReq) => {
		const { payload } = getShippingOptionData(values as any, regionId);

		return payload;
	};

	const isCreate = _.isEmpty(shippingOption);

	const onFinish = async (values: AdminPostShippingOptionsReq) => {
		const formValues = values as AdminPostShippingOptionsReq & {
			fulfillment_provider: { value: string; label: string };
			shipping_profile: string;
		};

		const selectedFulfillmentProvider = fulfillmentOptions.find(
			(option) => option.value === formValues.fulfillment_provider.value
		);

		const transformedValues = {
			...values,
			shipping_profile: { value: formValues.shipping_profile },
			fulfillment_provider: selectedFulfillmentProvider,
		};

		const payload = createPayload(transformedValues as any);

		if (isCreate) {
			await createShippingOption.mutateAsync(payload, {
				onSuccess: () => {
					message.success('Tạo mới phương thức vận chuyển thành công');
					form.resetFields();
					handleOk();
				},
				onError: (error: any) => {
					message.error(getErrorMessage(error));
				},
			});
			return;
		}
		if (!isCreate) {
			const updatedPayload = {
				requirements: payload.requirements,
				name: payload.name,
				amount: payload.amount,
				admin_only: payload.admin_only,
				metadata: payload.metadata,
			};

			await updateShippingOption.mutateAsync(updatedPayload as any, {
				onSuccess: () => {
					message.success('Cập nhật phương thức vận chuyển thành công');
					handleOk();
				},
				onError: (error: any) => {
					message.error(getErrorMessage(error));
				},
			});
			return;
		}
	};

	const { shippingProfileOptions, fulfillmentOptions } =
		useShippingOptionFormData(regionId);

	useEffect(() => {
		if (!state || !isCreate) {
			return;
		}

		const currentValues = form.getFieldsValue([
			'shipping_profile',
			'fulfillment_provider',
		]);
		const defaultProfile =
			shippingProfileOptions.find((option) =>
				String(option.label).toLowerCase().includes('default')
			) ?? shippingProfileOptions[0];
		const manualFulfillment =
			fulfillmentOptions.find((option) =>
				String(option.label).toLowerCase().includes('manual')
			) ?? fulfillmentOptions[0];

		form.setFieldsValue({
			...(currentValues.shipping_profile || !defaultProfile
				? {}
				: { shipping_profile: defaultProfile.value }),
			...(currentValues.fulfillment_provider || !manualFulfillment
				? {}
				: { fulfillment_provider: manualFulfillment }),
		});
	}, [form, fulfillmentOptions, isCreate, shippingProfileOptions, state]);

	useEffect(() => {
		if (!isCreate && shippingOption) {
			setVisibleInStore(!shippingOption.admin_only);
			const requirements = getRequirementsData(shippingOption as any);

			const requirementsMap = requirements?.reduce((acc, curr) => {
				acc[curr.type] = { amount: curr.amount, id: curr.id };
				return acc;
			}, {} as any);

			const fulfillment_provider = fulfillmentOptions.find(
				(option) => option.value === '0.0'
			);

			form.setFieldsValue({
				name: shippingOption?.name,
				price_type: shippingOption?.price_type,
				amount: shippingOption?.amount,
				store_option: !shippingOption?.admin_only,
				automatic_policy:
					shippingOption?.metadata?.automatic_shipping_policy === true,
				customer_pays_external:
					shippingOption?.metadata?.customer_pays_external === true,
				shipping_profile: shippingOption?.profile?.name,
				fulfillment_provider: fulfillment_provider,
				requirements: requirementsMap,
			});
		} else {
			setVisibleInStore(false);
			form.resetFields();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shippingOption]);

	const parser = (value: any) => {
		return String(value ?? '').replace(/[.,\s]/g, '');
	};
	const formatter = (value: any) => {
		if (value) {
			return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		}
		return value;
	};

	return (
		<SubmitModal
			title={
				isCreate
					? 'Tạo phương thức vận chuyển'
					: 'Cập nhật phương thức vận chuyển'
			}
			open={state}
			onOk={handleOk}
			handleCancel={handleCancel}
			form={form}
			loading={createShippingOption.isLoading || updateShippingOption.isLoading}
			width={800}
		>
			<Form form={form} onFinish={onFinish}>
				<Row gutter={[16, 8]} className="pt-4">
					<Col xs={24}>
						<Form.Item
							labelCol={{ span: 24 }}
							name="store_option"
							label="Hiển thị trong cửa hàng"
							help="Bật hoặc tắt tính năng hiển thị tùy chọn giao hàng trong cửa hàng."
							valuePropName="checked"
							initialValue={visibleInStore}
						>
							<Switch
								checked={visibleInStore}
								onChange={(checked) => {
									setVisibleInStore(checked);
									form.setFieldsValue({ store_option: checked });
								}}
							/>
						</Form.Item>
					</Col>

					<Divider />

					<Col xs={24}>
						<Form.Item
							name="automatic_policy"
							label="Tự động áp dụng theo giá trị đơn"
							help="Bật cho các mức phí mà hệ thống phải tự chọn. Nếu các khoảng bị hở hoặc chồng nhau, backend sẽ chặn tạo đơn an toàn."
							valuePropName="checked"
							initialValue={false}
						>
							<Switch />
						</Form.Item>
					</Col>

					{automaticPolicy && (
						<>
							<Col xs={24}>
								<Alert
									type="info"
									showIcon
									message="Cách nhập 3 mức hiện tại"
									description="≤ 5 triệu: tối đa 5.000.001, giá 0; trên 5 đến dưới 10 triệu: tối thiểu 5.000.001, tối đa 10.000.000, giá 30.000; từ 10 triệu: tối thiểu 10.000.000, giá 0."
									className="mb-4"
								/>
							</Col>
							<Col xs={24}>
								<Form.Item
									name="customer_pays_external"
									label="Khách tự trả phí vận chuyển ngoài hệ thống"
									help="Dùng cho mức đơn ≤ 5 triệu: phí lưu trên đơn là 0, khách thanh toán trực tiếp cho đơn vị giao hàng."
									valuePropName="checked"
									initialValue={false}
								>
									<Switch />
								</Form.Item>
							</Col>
						</>
					)}

					<Divider />

					<Col xs={24}>
						<Text strong>Chi tiết</Text>
					</Col>

					<Col xs={24} sm={12}>
						<Form.Item
							labelCol={{ span: 24 }}
							name="name"
							label="Tiêu đề"
							rules={[
								{
									required: true,
									message: 'Vui lòng nhập tên phương thức vận chuyển',
								},
							]}
						>
							<Input placeholder="Tiêu đề" />
						</Form.Item>
					</Col>

					<Form.Item
						noStyle
						shouldUpdate={(prevValues, currentValues) =>
							prevValues.price_type !== currentValues.price_type
						}
					>
						{({ getFieldValue }) => {
							const priceType = getFieldValue('price_type');
							return (
								<>
									<Col xs={24} sm={priceType === 'flat_rate' ? 6 : 12}>
										<Form.Item
											labelCol={{ span: 24 }}
											name="price_type"
											label="Loại giá"
											rules={[
												{ required: true, message: 'Vui lòng chọn loại giá' },
											]}
										>
											<Select
												placeholder="Chọn loại giá"
												options={[{ label: 'Giá cố định', value: 'flat_rate' }]}
											/>
										</Form.Item>
									</Col>

									{priceType === 'flat_rate' && (
										<Col xs={24} sm={6}>
											<Form.Item
												labelCol={{ span: 24 }}
												name="amount"
												label="Giá"
												rules={[
													{ required: true, message: 'Vui lòng nhập giá' },
													{
														type: 'number',
														message: 'Giá phải là số',
													},
												]}
											>
												<InputNumber
													placeholder="Nhập giá"
													addonAfter={'VND'}
													parser={parser}
													formatter={formatter}
												/>
											</Form.Item>
										</Col>
									)}
								</>
							);
						}}
					</Form.Item>
					<Col xs={24} sm={12}>
						<Form.Item
							labelCol={{ span: 24 }}
							name="shipping_profile"
							label="Hồ sơ giao hàng"
							rules={[
								{
									required: true,
									message: 'Vui lòng chọn một hồ sơ giao hàng',
								},
							]}
						>
							<Select
								placeholder="Chọn hồ sơ giao hàng"
								className="w-full"
								options={shippingProfileOptions}
								allowClear
								filterOption={(input, option) =>
									((option?.label as string) ?? '')
										.toLowerCase()
										.includes(input.toLowerCase())
								}
								disabled={!isCreate}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							labelCol={{ span: 24 }}
							name="fulfillment_provider"
							label="Phương thức đáp ứng"
							rules={[
								{
									required: true,
									message: 'Vui lòng chọn một phương thức đáp ứng',
								},
							]}
						>
							<Select
								placeholder="Chọn phương thức đáp ứng"
								className="w-full"
								options={fulfillmentOptions}
								filterOption={(input, option) =>
									((option?.label as string) ?? '')
										.toLowerCase()
										.includes(input.toLowerCase())
								}
								labelInValue
								disabled={!isCreate}
							/>
						</Form.Item>
					</Col>

					<Divider />

					<Col xs={24}>
						<Text strong>Yêu cầu</Text>
					</Col>

					<Col xs={24} sm={12}>
						<Form.Item
							labelCol={{ span: 24 }}
							name={['requirements', 'min_subtotal', 'amount']}
							label="Giá trị đơn hàng tối thiểu (có tính bằng)"
							rules={[
								{ type: 'number', min: 0, message: 'Giá trị phải là số dương' },
								({ getFieldValue }) => ({
									validator(_, value) {
										const maxSubtotal = getFieldValue([
											'requirements',
											'max_subtotal',
											'amount',
										]);
										if (maxSubtotal && value >= maxSubtotal) {
											return Promise.reject(
												'Giá trị tối thiểu phải nhỏ hơn giá trị tối đa'
											);
										}
										return Promise.resolve();
									},
								}),
							]}
						>
							<InputNumber
								placeholder="Nhập giá trị tối thiểu"
								addonAfter={'VND'}
								parser={parser}
								formatter={formatter}
								className="w-full"
							/>
						</Form.Item>
					</Col>

					<Col xs={24} sm={12}>
						<Form.Item
							labelCol={{ span: 24 }}
							name={['requirements', 'max_subtotal', 'amount']}
							label="Giá trị đơn hàng tối đa (không tính bằng)"
							rules={[
								{ type: 'number', min: 0, message: 'Giá trị phải là số dương' },
								({ getFieldValue }) => ({
									validator(_, value) {
										const minSubtotal = getFieldValue([
											'requirements',
											'min_subtotal',
											'amount',
										]);
										if (minSubtotal && value <= minSubtotal) {
											return Promise.reject(
												'Giá trị tối đa phải lớn hơn giá trị tối thiểu'
											);
										}
										return Promise.resolve();
									},
								}),
							]}
						>
							<InputNumber
								placeholder="Nhập giá trị tối đa"
								addonAfter={'VND'}
								parser={parser}
								formatter={formatter}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</SubmitModal>
	);
};

export default ShippingOptionModal;
