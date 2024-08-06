import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Text } from '@/components/Typography';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { setAddresses } from '@/modules/checkout/actions';
import { Cart, Region } from '@medusajs/medusa';
import { Divider, Form, FormProps, Select, message } from 'antd';
import { useState } from 'react';

export type ShippingAddressProps = {
	firstName: string;
	lastName: string;
	phone: string;
	address: string;
	province: string;
	district: string;
	ward: string;
	postalCode: string;
	countryCode: string;
};

const ShippingAddress = ({
	cart,
	countryCode,
	region,
}: {
	cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
	countryCode: string;
	region: Region;
}) => {
	const [form] = Form.useForm();
	const [isEditing, setIsEditing] = useState(true);
	const { refreshCart } = useCart();

	const onFinish: FormProps<ShippingAddressProps>['onFinish'] = async (
		values
	) => {
		const shippingAddress = {
			firstName: values.firstName,
			lastName: values.lastName,
			phone: values.phone,
			ward: values.ward,
			address: values.address,
			district: values.district,
			province: values.province,
			postalCode: values.postalCode,
			countryCode: values.countryCode,
		};

		try {
			await setAddresses(shippingAddress, cart?.email, cart?.id);
			message.success('Địa chỉ giao hàng đã được cập nhật');
			refreshCart();
			setIsEditing(false);
		} catch {
			message.error('Có lỗi xảy ra khi cập nhật địa chỉ giao hàng');
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
		form.setFieldsValue({
			firstName: cart?.shipping_address?.first_name,
			lastName: cart?.shipping_address?.last_name,
			phone: cart?.shipping_address?.phone,
			address: cart?.shipping_address?.address_2,
			province: cart?.shipping_address?.city,
			district: cart?.shipping_address?.province,
			ward: cart?.shipping_address?.address_1,
			postalCode: cart?.shipping_address?.postal_code,
			countryCode: cart?.shipping_address?.country_code,
		});
	};

	return (
		<>
			{cart?.id && isEditing && (
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
						<Input placeholder="Họ" className="rounded-none" />
					</Form.Item>

					<Form.Item
						label="Tên"
						name="lastName"
						rules={[{ required: true, message: 'Tên phải chứa 2-40 ký tự' }]}
					>
						<Input placeholder="Tên" className="rounded-none" />
					</Form.Item>

					<Form.Item
						label="Số điện thoại"
						name="phone"
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
						/>
					</Form.Item>

					<Form.Item
						label="Tỉnh/Thành phố"
						name="province"
						rules={[
							{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' },
						]}
					>
						<Input placeholder="Chọn tỉnh/thành phố" className="rounded-none" />
					</Form.Item>

					<Form.Item
						label="Quận/Huyện"
						name="district"
						rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
					>
						<Input placeholder="Chọn quận/huyện" className="rounded-none" />
					</Form.Item>

					<Form.Item
						label="Khu vực"
						name="ward"
						rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
					>
						<Input placeholder="Chọn khu vực" className="rounded-none" />
					</Form.Item>

					<Form.Item
						label="Mã bưu điện"
						name="postalCode"
						rules={[{ required: true, message: 'Vui lòng chọn mã bưu điện' }]}
					>
						<Input placeholder="Chọn mã bưu điện" className="rounded-none" />
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
			)}

			{!isEditing && (
				<Card className="shadow-none">
					<Flex className="flex-col" gap={4}>
						<Flex gap={10} align="baseline">
							<Text className="font-bold">
								{cart?.shipping_address?.first_name}{' '}
								{cart?.shipping_address?.last_name}
							</Text>
							<Text className="text-[#666666] text-[13px]">
								{cart?.shipping_address?.phone}
							</Text>
						</Flex>
						<Text className="text-[12px]">
							{cart?.shipping_address?.address_2}
						</Text>
						<Text className="text-[12px]">
							{cart?.shipping_address?.address_1},{cart?.shipping_address?.city}
							, {cart?.shipping_address?.province},
							{cart?.shipping_address?.postal_code}
						</Text>
						<Flex gap={8} className="absolute bottom-2 right-5">
							<Button
								type="link"
								onClick={handleEdit}
								className="text-[12px] text-[#2d68a8] p-0"
							>
								Chỉnh Sửa
							</Button>
						</Flex>
					</Flex>
				</Card>
			)}
		</>
	);
};

export default ShippingAddress;
