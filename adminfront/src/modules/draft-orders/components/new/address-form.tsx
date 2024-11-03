import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Title } from '@/components/Typography';
import { Option } from '@/types/shared';
import { Col, Divider, Form, Row } from 'antd';
import React from 'react';

export type AddressPayload = {
	first_name: string;
	last_name: string;
	company: string | null;
	address_1: string;
	address_2: string | null;
	city: string;
	province: string | null;
	country_code: Option;
	postal_code: string;
	phone: string | null;
};

export enum AddressType {
	SHIPPING = 'shipping',
	BILLING = 'billing',
	LOCATION = 'location',
}

type AddressFormProps = {
	form: any;
	countryOptions: Option[];
	type: AddressType;
	noTitle?: boolean;
};

const AddressForm = ({
	form,
	countryOptions,
	type,
	noTitle = false,
}: AddressFormProps) => {
	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={{ country_code: countryOptions[0]?.value }}
		>
			{type === AddressType.SHIPPING || type === AddressType.BILLING ? (
				<>
					<Title level={2}>Chung</Title>
					<Divider />
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item
								label="Họ"
								name={['shipping_address', 'first_name']}
								rules={[{ required: true, message: 'Họ phải chứa 2-40 ký tự' }]}
								className="lg:mb-3"
							>
								<Input placeholder="Họ" className="rounded-none" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label="Tên"
								name={['shipping_address', 'last_name']}
								rules={[
									{ required: true, message: 'Tên phải chứa 2-40 ký tự' },
								]}
								className="lg:mb-3"
							>
								<Input placeholder="Tên" className="rounded-none" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item
								label="Công ty"
								name={['shipping_address', 'company']}
								rules={[
									{
										required: true,
										message: 'Vui lòng nhập tên doanh nghiệp',
									},
								]}
							>
								<Input placeholder="Công ty" className="rounded-none" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label="Số điện thoại"
								name={['shipping_address', 'phone']}
								rules={[
									{
										required: true,
										pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
										message:
											'Số điện thoại phải từ 10 đến 11 chữ số bắt đầu bằng 0.',
									},
								]}
								help="Một số điện thoại hợp lệ là cần thiết để giao hàng."
							>
								<Input placeholder="Số điện thoại" className="rounded-none" />
							</Form.Item>
						</Col>
					</Row>
				</>
			) : null}

			<Divider />

			{!noTitle && (
				<Title level={3}>
					{type === AddressType.BILLING
						? 'Địa chỉ thanh toán'
						: type === AddressType.SHIPPING
						? 'Địa chỉ giao hàng'
						: 'Địa chỉ'}
				</Title>
			)}

			<Row gutter={16}>
				<Col xs={24} md={12}>
					<Form.Item
						label="Địa chỉ"
						name={['shipping_address', 'address_1']}
						rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
					>
						<Input
							placeholder="Địa chỉ đường phố, căn hộ, Suite, Đơn vị, v.v."
							className="rounded-none"
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						label="Khu vực"
						name={['shipping_address', 'address_2']}
						rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
					>
						<Input placeholder="Chọn khu vực" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col xs={24} md={12}>
					<Form.Item
						label="Mã bưu điện"
						name={['shipping_address', 'postal_code']}
						rules={[{ required: true, message: 'Vui lòng chọn mã bưu điện' }]}
					>
						<Input placeholder="Chọn mã bưu điện" className="rounded-none" />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						label="Quận/Huyện"
						name={['shipping_address', 'city']}
						rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
					>
						<Input placeholder="Chọn quận/huyện" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col xs={24} md={12}>
					<Form.Item
						label="Tỉnh/Thành phố"
						name={['shipping_address', 'province']}
						rules={[
							{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' },
						]}
					>
						<Input placeholder="Chọn tỉnh/thành phố" />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						label="Quốc gia"
						name={['shipping_address', 'country_code']}
						required
					>
						<Select options={countryOptions} placeholder="Chọn quốc gia" />
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default AddressForm;
