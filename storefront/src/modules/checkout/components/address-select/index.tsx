import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useCustomer } from '@/lib/providers/user/user-provider';
import AddressForm from '@/modules/common/components/address-form';
import { Address, Region } from '@medusajs/medusa';
import { Col, List, Row, message } from 'antd';
import { useState } from 'react';
import { setAddresses } from '../../actions';

const AddressSelect = ({
	region,
	onAddressClose,
}: {
	region: Region;
	onAddressClose: () => void;
}) => {
	const { state, onOpen, onClose } = useToggleState(false);
	const { customer } = useCustomer();
	const { selectedAddress, setSelectedAddress, refreshCart } = useCart();
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

	const handleEditAddress = (address: Address) => {
		setEditingAddress(address);
		onOpen();
	};

	const handleAddAddress = () => {
		setEditingAddress(null);
		onOpen();
	};

	// onFinish form address based on selected address
	const onFinish = async (values: any, email: string) => {
		const shippingAddress = {
			firstName: values.first_name,
			lastName: values.last_name,
			phone: values.phone,
			ward: values.address_1,
			address: values.address_2,
			district: values.city,
			province: values.province,
			postalCode: values.postal_code,
			countryCode: values.country_code,
		};
		try {
			await setAddresses(shippingAddress, email);
			message.success('Địa chỉ giao hàng đã được cập nhật');
			refreshCart();
		} catch {
			message.error('Có lỗi xảy ra khi cập nhật địa chỉ giao hàng');
		}
	};

	return (
		<Flex className="flex-col">
			<Text className="flex w-full justify-center text-[28px] font-bold p-2">
				Địa chỉ giao hàng
			</Text>
			<Button
				className="max-w-[200px] flex items-center justify-center rounded-none text-sm font-bold border-none mt-5"
				onClick={handleAddAddress}
			>
				+ Thêm địa chỉ mới
			</Button>

			<Flex className="w-full mt-5">
				<Row className="w-full">
					{customer?.shipping_addresses.map((item) => (
						<Col
							span={11}
							key={item.id}
							className={`mr-2 mb-4 ${
								selectedAddress?.id === item.id && 'border-solid'
							}`}
							style={{ borderStyle: 'ridge', borderWidth: '1px' }}
						>
							<List.Item className="border p-4 list-none pb-12 cursor-pointer">
								<List.Item.Meta
									description={
										<Flex
											className="flex-col border-"
											gap={4}
											onClick={() => {
												setSelectedAddress(item);
												onFinish(item, customer?.email!);
												onAddressClose();
											}}
										>
											<Flex gap={10} align="baseline">
												<Text className="font-bold">
													{item.first_name} {item.last_name}
												</Text>
												<Text className="text-[#666666] text-[13px]">
													{item.phone}
												</Text>
											</Flex>
											<Text className="text-[12px]">{item.address_2}</Text>
											<Text className="text-[12px]">
												{item.address_1}, {item.city}, {item.province}{' '}
												{item.postal_code}
											</Text>
											<Flex gap={8} className="absolute bottom-2 right-5">
												<Button
													type="link"
													onClick={(e) => {
														e.stopPropagation();
														handleEditAddress(item);
													}}
													className="text-[12px] text-[#2d68a8] p-0"
												>
													Chỉnh Sửa
												</Button>
											</Flex>
										</Flex>
									}
								/>
							</List.Item>
						</Col>
					))}
				</Row>
			</Flex>

			<Modal
				open={state}
				onCancel={onClose}
				footer={<div />}
				styles={{
					content: { borderRadius: '0', height: '560px' },
					body: { height: '500px' },
				}}
				className="w-[700px] h-[560px]"
			>
				<div className="overflow-y-auto h-full px-4 pt-4">
					<Text className="flex w-full font-bold text-[22px] justify-center uppercase">
						Địa chỉ giao hàng
					</Text>
					<AddressForm
						region={region}
						onClose={onClose}
						editingAddress={editingAddress}
					/>
				</div>
			</Modal>
		</Flex>
	);
};

export default AddressSelect;
