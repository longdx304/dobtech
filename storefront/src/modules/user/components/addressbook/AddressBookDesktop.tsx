import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useCustomer } from '@/lib/providers/user/user-provider';
import AddressForm from '@/modules/common/components/address-form';
import { Address, Region } from '@medusajs/medusa';
import { Col, List, message, Modal, Row } from 'antd';
import { useState } from 'react';
import {
	deleteCustomerShippingAddress,
	updateCustomerShippingAddress,
} from '../../actions';

type Props = {
	region: Region;
};

const AddressBookDesktop = ({ region }: Props) => {
	const { customer } = useCustomer();
	const { state, onOpen, onClose } = useToggleState(false);
	const [removing, setRemoving] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

	const removeAddress = async (addressId: string) => {
		setRemoving(true);
		await deleteCustomerShippingAddress(addressId);
		setRemoving(false);
	};

	const showConfirm = (addressId: string) => {
		Modal.confirm({
			title: 'Bạn có chắc xóa địa chỉ này?',
			okText: 'Vâng',
			cancelText: 'Không',
			onOk: () => removeAddress(addressId),
			className: '[&_.ant-btn-primary]:bg-black',
		});
	};

	const handleEditAddress = (address: Address) => {
		setEditingAddress(address);
		onOpen();
	};

	const handleAddAddress = () => {
		setEditingAddress(null);
		onOpen();
	};


	const setDefaultAddress = async (address: Address) => {
		const prevAddress = customer?.shipping_addresses.find(
			(item) => item.metadata?.is_default === true
		);

		if (prevAddress) {
			await updateCustomerShippingAddress(prevAddress.id, {
				...prevAddress,
				metadata: {
					...prevAddress.metadata,
					is_default: false,
				},
			} as any);
		}

		const updatedAddress = {
			...address,
			metadata: {
				...address.metadata,
				is_default: true,
			},
		};

		await updateCustomerShippingAddress(address.id, updatedAddress as any);
		message.success('Đã thay đổi địa chỉ mặc định');
	};
	return (
		<Flex className="flex-col">
			<Text className="flex w-full justify-center text-[28px] font-bold p-2">
				Sổ địa chỉ của tôi
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
							<List.Item className="border p-4 list-none pb-12">
								<List.Item.Meta
									description={
										<Flex className="flex-col" gap={4}>
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
												{/* <Button
													type="link"
													onClick={() => {}}
													className="text-[12px] text-[#2d68a8] p-0"
												>
													Đặt Địa Chỉ Mặc Định
												</Button> */}
												{!item.metadata?.is_default && (
													<Button
														type="link"
														onClick={() => setDefaultAddress(item)}
														className="text-[12px] text-[#2d68a8] p-0"
													>
														Đặt Địa Chỉ Mặc Định
													</Button>
												)}
												<Button
													type="link"
													onClick={() => showConfirm(item.id)}
													className="text-[12px] text-[#2d68a8] p-0"
												>
													Xóa
												</Button>
												<Button
													type="link"
													onClick={() => handleEditAddress(item)}
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
				title="Địa chỉ giao hàng"
				open={state}
				onCancel={onClose}
				footer={null}
			>
				<AddressForm
					customer={customer}
					region={region}
					onClose={onClose}
					editingAddress={editingAddress}
				/>
			</Modal>
		</Flex>
	);
};

export default AddressBookDesktop;
