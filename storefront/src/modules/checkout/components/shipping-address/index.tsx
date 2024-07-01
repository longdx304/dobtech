import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Cart, Region } from '@medusajs/medusa';
import { Divider, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';

const ShippingAddress = ({
	cart,
	countryCode,
	region,
}: {
	cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
	countryCode: string;
	region: Region;
}) => {
	const [formData, setFormData] = useState({
		'shipping_address.first_name': cart?.shipping_address?.first_name || '',
		'shipping_address.last_name': cart?.shipping_address?.last_name || '',
		'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
		'shipping_address.address_2': cart?.shipping_address?.address_2 || '',
		'shipping_address.company': cart?.shipping_address?.company || '',
		'shipping_address.postal_code': cart?.shipping_address?.postal_code || '',
		'shipping_address.city': cart?.shipping_address?.city || '',
		'shipping_address.country_code':
			cart?.shipping_address?.country_code || countryCode || '',
		'shipping_address.province': cart?.shipping_address?.province || '',
		email: cart?.email || '',
		'shipping_address.phone': cart?.shipping_address?.phone || '',
	});

	useEffect(() => {
		setFormData({
			'shipping_address.first_name': cart?.shipping_address?.first_name || '',
			'shipping_address.last_name': cart?.shipping_address?.last_name || '',
			'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
			'shipping_address.address_2': cart?.shipping_address?.address_2 || '',
			'shipping_address.company': cart?.shipping_address?.company || '',
			'shipping_address.postal_code': cart?.shipping_address?.postal_code || '',
			'shipping_address.city': cart?.shipping_address?.city || '',
			'shipping_address.country_code':
				cart?.shipping_address?.country_code || '',
			'shipping_address.province': cart?.shipping_address?.province || '',
			email: cart?.email || '',
			'shipping_address.phone': cart?.shipping_address?.phone || '',
		});
	}, [cart?.shipping_address, cart?.email]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLInputElement | HTMLSelectElement
		>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		console.log('Received values of form:', values);
	};

	return (
		<>
			<Form
				form={form}
				onFinish={onFinish}
				layout="vertical"
				initialValues={{ countryCode: region.countries[0].iso_2 }}
			>
				<Form.Item label="Quốc gia" name="countryCode">
					<Select
						className="[&_.ant-select-selector]:!rounded-none"
						options={region.countries.map((country) => ({
							label: country.display_name,
							value: country.iso_2,
						}))}
						suffixIcon={null}
						size="large"
						disabled
					/>
				</Form.Item>

				<Divider className="my-4" />

				<Form.Item
					label="Họ"
					name="firstName"
					rules={[{ required: true, message: 'Họ phải chứa 2-40 ký tự' }]}
				>
					<Input
						placeholder="Họ"
						className="rounded-none"
						value={formData['shipping_address.first_name']}
						onChange={handleChange}
					/>
				</Form.Item>

				<Form.Item
					label="Tên"
					name="lastName"
					rules={[{ required: true, message: 'Tên phải chứa 2-40 ký tự' }]}
				>
					<Input
						placeholder="Tên"
						className="rounded-none"
						value={formData['shipping_address.last_name']}
					/>
				</Form.Item>

				<Form.Item
					label="Số điện thoại"
					name="phone"
					rules={[
						{
							required: true,
							pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
							message: 'Số điện thoại phải từ 10 đến 11 chữ số bắt đầu bằng 0.',
						},
					]}
					help="Một số điện thoại hợp lệ là cần thiết để giao hàng."
				>
					<Input
						placeholder="Số điện thoại"
						className="rounded-none"
						value={formData['shipping_address.phone']}
					/>
				</Form.Item>

				<Divider className="my-4" />

				<Form.Item
					label="Địa chỉ"
					name="address"
					rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
					help="Vui lòng nhập bằng tiếng Việt tiêu chuẩn có dấu trọng âm."
				>
					<Input
						placeholder="Địa chỉ đường phố ,căn hộ, Suĩte, Đơn vi,v.v."
						className="rounded-none"
						value={formData['shipping_address.address_2']}
					/>
				</Form.Item>

				<Form.Item
					label="Tỉnh/Thành phố"
					name="province"
					rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
				>
					<Input
						placeholder="Chọn tỉnh/thành phố"
						className="rounded-none"
						value={formData['shipping_address.province']}
					/>
				</Form.Item>

				<Form.Item
					label="Quận/Huyện"
					name="district"
					rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
				>
					<Input
						placeholder="Chọn quận/huyện"
						className="rounded-none"
						value={formData['shipping_address.city']}
					/>
				</Form.Item>

				<Form.Item
					label="Khu vực"
					name="ward"
					rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
				>
					<Input
						placeholder="Chọn khu vực"
						className="rounded-none"
						value={formData['shipping_address.address_1']}
					/>
				</Form.Item>

				<Form.Item
					label="Mã bưu điện"
					name="postalCode"
					rules={[{ required: true, message: 'Vui lòng chọn mã bưu điện' }]}
				>
					<Input
						placeholder="Chọn mã bưu điện"
						className="rounded-none"
						value={formData['shipping_address.postal_code']}
					/>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="flex items-center justify-center w-full rounded-none text-lg uppercase px-4 py-6 font-bold"
					>
						Lưu
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default ShippingAddress;
