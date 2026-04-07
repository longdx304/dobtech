'use client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import { useAdminDeleteCustomerAddress } from '@/lib/hooks/api/customer/mutations';
import { getErrorMessage } from '@/lib/utils';
import { ICustomerResponse } from '@/types/customer';
import { Address } from '@medusajs/medusa';
import { useQuery } from '@tanstack/react-query';
import { Col, Divider, Form, List, Popconfirm, Row, message } from 'antd';
import { adminCustomerKeys, useAdminUpdateCustomer, useMedusa } from 'medusa-react';
import { FC, useEffect, useMemo, useState } from 'react';
import CustomerAddressModal from './customer-address-modal';

type Props = {
	state: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	customer: ICustomerResponse;
};

type CustomerFormProps = {
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
	customer_code: string;
};

function formatAddressLine(a: Address): string {
	const parts = [
		[a.first_name, a.last_name].filter(Boolean).join(' ').trim(),
		a.address_1,
		a.address_2,
		a.city,
		a.province,
		a.country_code?.toUpperCase(),
		a.phone,
	]
		.map((p) => (typeof p === 'string' ? p.trim() : p))
		.filter(Boolean);
	return parts.join(', ');
}

const EditCustomerModal: FC<Props> = ({
	state,
	handleOk,
	handleCancel,
	customer,
}) => {
	const [form] = Form.useForm();
	const updateCustomer = useAdminUpdateCustomer(customer.id);
	const { client } = useMedusa();
	const [addressModalOpen, setAddressModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

	const { data: customerDetail, refetch: refetchCustomerDetail } = useQuery({
		queryKey: [
			...adminCustomerKeys.detail(customer.id),
			'expand',
			'shipping_addresses',
		],
		queryFn: async () => {
			const res = await client.admin.custom.get(
				`/admin/customers/${customer.id}?expand=shipping_addresses`
			);
			const r = res as { customer?: ICustomerResponse; data?: { customer?: ICustomerResponse } };
			return r.customer ?? r.data?.customer;
		},
		enabled: state && !!customer.id,
	});

	const mergedCustomer = useMemo(() => {
		return {
			...customer,
			...(customerDetail ?? {}),
			shipping_addresses:
				customerDetail?.shipping_addresses ?? customer.shipping_addresses,
		} as ICustomerResponse;
	}, [customer, customerDetail]);

	const deleteAddress = useAdminDeleteCustomerAddress(customer.id, {
		onSuccess: () => {
			refetchCustomerDetail();
		},
	});

	useEffect(() => {
		form.setFieldsValue({
			email: customer?.email,
			first_name: customer?.first_name,
			last_name: customer?.last_name,
			phone: customer?.phone,
			customer_code: customer?.customer_code,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customer]);

	const onFinish = async (values: CustomerFormProps) => {
		await updateCustomer.mutateAsync(
			{
				first_name: values.first_name,
				last_name: values.last_name,
				phone: values?.phone || undefined,
				customer_code: values?.customer_code || undefined,
			} as any,
			{
				onSuccess: () => {
					message.success('Cập nhật thông tin khách hàng thành công');
					refetchCustomerDetail();
					handleOk();
				},
				onError: (error) => {
					message.error(getErrorMessage(error));
				},
			}
		);
	};

	const addresses = mergedCustomer.shipping_addresses ?? [];

	return (
		<>
			<SubmitModal
				title="Chỉnh sửa thông tin khách hàng"
				open={state}
				onOk={handleOk}
				handleCancel={handleCancel}
				isLoading={updateCustomer.isLoading}
				form={form}
			>
				<Form form={form} onFinish={onFinish}>
					<Row gutter={[16, 8]} className="pt-4">
						<Col xs={24} sm={12}>
							<Form.Item
								labelCol={{ span: 24 }}
								name="first_name"
								label="Tên"
								rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
							>
								<Input placeholder="Tên" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								labelCol={{ span: 24 }}
								name="last_name"
								label="Họ"
								rules={[{ message: 'Vui lòng nhập họ' }]}
							>
								<Input placeholder="Họ" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item labelCol={{ span: 24 }} name="email" label="Email">
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								labelCol={{ span: 24 }}
								name="phone"
								label="Số điện thoại"
								rules={[
									{ min: 9, message: 'Số điện thoại ít nhất phải 10 chữ số' },
									{
										type: 'string',
										message: 'Số điện thoại không hợp lệ',
									},
								]}
							>
								<Input placeholder="0987654321" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								labelCol={{ span: 24 }}
								name="customer_code"
								label="Mã khách hàng"
							>
								<Input placeholder="Mã khách hàng" />
							</Form.Item>
						</Col>
					</Row>
				</Form>

				<Divider className="my-4" />

				<Title level={5} className="mb-2">
					Địa chỉ giao hàng
				</Title>
				<div className="mb-3">
					<Button
						type="default"
						size="small"
						onClick={() => {
							setEditingAddress(null);
							setAddressModalOpen(true);
						}}
					>
						Thêm địa chỉ
					</Button>
				</div>
				<List
					size="small"
					bordered
					dataSource={addresses}
					locale={{ emptyText: 'Chưa có địa chỉ đã lưu' }}
					renderItem={(addr) => (
						<List.Item
							actions={[
								<Button
									type="link"
									key="edit"
									size="small"
									className="!px-1"
									onClick={() => {
										setEditingAddress(addr);
										setAddressModalOpen(true);
									}}
								>
									Sửa
								</Button>,
								<Popconfirm
									key="del"
									title="Xóa địa chỉ này?"
									okText="Xóa"
									cancelText="Hủy"
									onConfirm={async () => {
										try {
											await deleteAddress.mutateAsync(addr.id);
											message.success('Đã xóa địa chỉ');
											refetchCustomerDetail();
										} catch (error) {
											message.error(getErrorMessage(error));
										}
									}}
								>
									<Button type="link" danger size="small" className="!px-1">
										Xóa
									</Button>
								</Popconfirm>,
							]}
						>
							<div className="text-sm pr-2">{formatAddressLine(addr)}</div>
						</List.Item>
					)}
				/>
			</SubmitModal>

			<CustomerAddressModal
				open={addressModalOpen}
				onClose={() => {
					setAddressModalOpen(false);
					setEditingAddress(null);
				}}
				onSaved={() => refetchCustomerDetail()}
				customerId={customer.id}
				address={editingAddress}
			/>
		</>
	);
};

export default EditCustomerModal;
