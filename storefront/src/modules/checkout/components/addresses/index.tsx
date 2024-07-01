'use client';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Empty } from '@/components/Empty';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useCustomer } from '@/lib/providers/user/user-provider';
import AddressForm from '@/modules/common/components/address-form';
import { Address, Cart, Customer, Region } from '@medusajs/medusa';
import { Col, Form, List, Row } from 'antd';
import { ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ShippingAddress from '../shipping-address';

const Addresses = ({
	cart,
	customer,
	region,
}: {
	cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
	customer: Omit<Customer, 'password_hash'> | null;
	region: Region;
}) => {
	const countryCode = 'vn';
	const [form] = Form.useForm();
	const { state, onOpen, onClose: onAddressClose } = useToggleState(false);
	const { selectedAddress, setSelectedAddress } = useCart();

	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

	const handleEditAddress = (address: Address) => {
		setEditingAddress(address);
		onOpen();
	};

	const handleEdit = () => {
		if (editingAddress) {
			setEditingAddress(null);
		}
		onOpen();
	};

	const countriesInRegion = useMemo(
		() => cart?.region.countries.map((c) => c.iso_2),
		[cart?.region]
	);

	// check if customer has saved addresses that are in the current region
	const addressesInRegion = useMemo(
		() =>
			customer?.shipping_addresses.filter(
				(a) => a.country_code && countriesInRegion?.includes(a.country_code)
			),
		[customer?.shipping_addresses, countriesInRegion]
	);

	useEffect(() => {
		// compare selected address id with customer shipping addresses id
		// update selected address
		const selectedAddressId = selectedAddress?.id;
		const address = customer?.shipping_addresses.find(
			(a) => a.id === selectedAddressId
		);
		if (address) {
			setSelectedAddress(address);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customer?.shipping_addresses]);

	return (
		<>
			<Flex className="flex-row mb-2" align="center" justify="space-between">
				<Text className="flex flex-row text-lg items-baseline font-bold">
					Địa chỉ giao hàng
				</Text>
				{addressesInRegion && (
					<Flex
						onClick={handleEdit}
						data-testid="edit-address-button"
						className="font-bold cursor-pointer"
						align="center"
					>
						<Text className="text-xs">Thay đổi</Text>
						<ChevronRight size={16} />
					</Flex>
				)}
			</Flex>
			{addressesInRegion && selectedAddress ? (
				<Card className="shadow-none">
					<Flex className="flex-col" gap={4}>
						<Flex gap={10} align="baseline">
							<Text className="font-bold">
								{selectedAddress?.first_name} {selectedAddress?.last_name}
							</Text>
							<Text className="text-[#666666] text-[13px]">
								{selectedAddress?.phone}
							</Text>
						</Flex>
						<Text className="text-[12px]">{selectedAddress?.address_2}</Text>
						<Text className="text-[12px]">
							{selectedAddress?.address_1}, {selectedAddress?.city},{' '}
							{selectedAddress?.province} {selectedAddress?.postal_code}
						</Text>
						<Flex gap={8} className="absolute bottom-2 right-5">
							<Button
								type="link"
								onClick={() => handleEditAddress(selectedAddress)}
								className="text-[12px] text-[#2d68a8] p-0"
							>
								Chỉnh Sửa
							</Button>
						</Flex>
					</Flex>
				</Card>
			) : (
				customer && <Empty description="Không có địa chỉ, vui lòng lựa chọn" />
			)}

			{/* if user buy item without auth */}
			{!customer && (
				<ShippingAddress
					countryCode={countryCode}
					cart={cart}
					region={region}
				/>
			)}

			{/* Modal address */}
			<Modal
				open={state}
				onCancel={onAddressClose}
				footer={<div />}
				styles={{
					content: { borderRadius: '0', height: '560px' },
					body: { height: '500px' },
				}}
				className="w-[700px] h-[560px]"
			>
				{editingAddress ? (
					<div className="overflow-y-auto h-full px-4 pt-4">
						<Text className="flex w-full font-bold text-[22px] justify-center uppercase">
							Địa chỉ giao hàng
						</Text>
						<AddressForm
							region={region}
							onClose={onAddressClose}
							editingAddress={editingAddress}
						/>
					</div>
				) : (
					<AllAddresses region={region} onAddressClose={onAddressClose} />
				)}
			</Modal>
		</>
	);
};

export default Addresses;

const AllAddresses = ({
	region,
	onAddressClose,
}: {
	region: Region;
	onAddressClose: () => void;
}) => {
	const { state, onOpen, onClose } = useToggleState(false);
	const { customer } = useCustomer();
	const { selectedAddress, setSelectedAddress } = useCart();
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

	const handleEditAddress = (address: Address) => {
		setEditingAddress(address);
		onOpen();
	};

	const handleAddAddress = () => {
		setEditingAddress(null);
		onOpen();
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
							className="border-solid mr-2 mb-4 border-1"
						>
							<List.Item className="border p-4 list-none pb-12 cursor-pointer">
								<List.Item.Meta
									description={
										<Flex
											className="flex-col"
											gap={4}
											onClick={() => {
												setSelectedAddress(item);
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
