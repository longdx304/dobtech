'use client';
import { Button } from '@/components/Button';
import { Input, InputPassword } from '@/components/Input';
import { SubmitModal } from '@/components/Modal';
import { Title } from '@/components/Typography';
import {
	useAdminDeleteCustomerAddress,
	useAdminUpdateCustomerAccount,
} from '@/lib/hooks/api/customer/mutations';
import { getErrorMessage } from '@/lib/utils';
import { ICustomerResponse } from '@/types/customer';
import { Address } from '@medusajs/medusa';
import { useQuery } from '@tanstack/react-query';
import {
	Col,
	Divider,
	Form,
	List,
	Popconfirm,
	Row,
	Switch,
	Tag,
	message,
} from 'antd';
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
	customer_note?: string;
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
	const updateAccount = useAdminUpdateCustomerAccount(customer.id);
	const { client } = useMedusa();
	const [addressModalOpen, setAddressModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [appPassword, setAppPassword] = useState('');

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
			customer_note: customer?.metadata?.customer_note,
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
				metadata: {
					...(mergedCustomer.metadata ?? {}),
					customer_note: values.customer_note || '',
				},
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

	const hasAccount = !!(mergedCustomer as any)?.has_account;
	const isActive = !!mergedCustomer?.is_active;

	const handleSetPassword = async () => {
		if (!appPassword || appPassword.length < 6) {
			message.error('Mật khẩu phải có ít nhất 6 ký tự');
			return;
		}
		const phone = form.getFieldValue('phone');
		if (!phone) {
			message.error('Cần có số điện thoại để khách đăng nhập app');
			return;
		}
		try {
			await updateAccount.mutateAsync({ password: appPassword, phone });
			message.success('Đã đặt mật khẩu đăng nhập app');
			setAppPassword('');
			refetchCustomerDetail();
		} catch (error) {
			message.error(getErrorMessage(error));
		}
	};

	const handleToggleAccess = async (enabled: boolean) => {
		try {
			await updateAccount.mutateAsync({ is_active: enabled });
			message.success(enabled ? 'Đã cho phép đăng nhập app' : 'Đã khóa đăng nhập app');
			refetchCustomerDetail();
		} catch (error) {
			message.error(getErrorMessage(error));
		}
	};

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
						<Col xs={24}>
							<Form.Item
								labelCol={{ span: 24 }}
								name="customer_note"
								label="Ghi chú"
							>
								<Input placeholder="Ghi chú khách hàng" />
							</Form.Item>
						</Col>
					</Row>
				</Form>

				<Divider className="my-4" />

				<div className="flex items-center justify-between mb-2">
					<Title level={5} className="!mb-0">
						Đăng nhập App tồn kho
					</Title>
					{hasAccount ? (
						isActive ? (
							<Tag color="green">Đang bật</Tag>
						) : (
							<Tag color="red">Đã khóa</Tag>
						)
					) : (
						<Tag>Chưa có tài khoản</Tag>
					)}
				</div>
				<div className="text-xs text-gray-500 mb-3">
					Khách dùng <b>số điện thoại + mật khẩu</b> ở trên để đăng nhập app xem
					tồn kho. Đặt mật khẩu để cấp quyền truy cập.
				</div>
				<Row gutter={[16, 8]} align="bottom">
					<Col xs={24} sm={14}>
						<label className="text-sm">Mật khẩu đăng nhập app</label>
						<InputPassword
							placeholder={
								hasAccount ? 'Nhập mật khẩu mới để đặt lại' : 'Tạo mật khẩu'
							}
							value={appPassword}
							onChange={(e) => setAppPassword(e.target.value)}
							autoComplete="new-password"
						/>
					</Col>
					<Col xs={24} sm={10}>
						<Button
							type="primary"
							onClick={handleSetPassword}
							loading={updateAccount.isLoading}
							block
						>
							{hasAccount ? 'Đặt lại mật khẩu' : 'Tạo tài khoản app'}
						</Button>
					</Col>
				</Row>
				{hasAccount && (
					<div className="flex items-center gap-2 mt-3">
						<Switch
							checked={isActive}
							onChange={handleToggleAccess}
							loading={updateAccount.isLoading}
						/>
						<span className="text-sm">Cho phép đăng nhập app</span>
					</div>
				)}

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
