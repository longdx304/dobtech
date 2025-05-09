import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useCustomer } from '@/lib/providers/user/user-provider';
import AddressForm from '@/modules/common/components/address-form';
import { Region } from '@/types/medusa';
import { Address } from '@medusajs/medusa';
import { message, Modal, Switch } from 'antd';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
	deleteCustomerShippingAddress,
	updateCustomerShippingAddress,
} from '../../actions';


type Props = {
	region: Region;
};

const AddressBookMobile = ({ region }: Props) => {
	const router = useRouter();
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
		<Flex
			justify="space-between"
			className="flex-col min-h-[98vh] bg-[#f6f6f6]"
		>
			<div className="user-setting">
				<Flex
					align="center"
					justify="space-between"
					style={{ borderBottom: '11px solid #f6f6f6' }}
					className="pb-2 bg-white"
				>
					<div className="flex" onClick={() => router.back()}>
						<ChevronLeft size={24} className="text-[#767676] pl-[12px]" />
					</div>
					<Text className="font-bold text-center">Địa chỉ của tôi</Text>
					<div className="w-[36px]" />
				</Flex>

				{customer?.shipping_addresses.length === 0 ? (
					<Flex align="center" justify="center" className="py-16 flex-col">
						<Image
							src="/images/empty-address.webp"
							width={150}
							height={150}
							alt="Empty address"
						/>
						<Text className="text-center text-[#767676] font-normal">
							Không có địa chỉ nào tại đây
						</Text>
					</Flex>
				) : (
					<Flex className="flex-col">
						{customer?.shipping_addresses.map((address) => (
							<Flex key={address.id} className="px-4 bg-white mb-2 flex-col">
								<Flex
									className="flex-col py-4"
									align="baseline"
									onClick={() => handleEditAddress(address)}
								>
									<Flex gap={10}>
										<Text className="font-bold">
											{address.first_name} {address.last_name}
										</Text>
										<Text className="text-[#767676] text-[13px]">
											{address.phone}
										</Text>
									</Flex>
									<Text className="text-[#767676]">{address.address_1}</Text>
									<Text className="text-[#767676]">
										{address.city}, {address.province}
									</Text>
								</Flex>
								<Flex align="center" style={{ borderTop: '1px solid #e5e5e5' }}>
									<Flex gap={4}>
										<Switch
											onChange={() => setDefaultAddress(address)}
											checked={address.metadata?.is_default === true}
										/>
										<Text className="text-[#767676] text-[13px]">
											{address.metadata?.is_default === true && 'Mặc định'}
											{address.metadata?.is_default === false &&
												'Đặt làm địa chỉ mặc định'}
										</Text>
									</Flex>
									<Button
										className="ml-auto bg-white shadow-none text-black border-none"
										onClick={() => showConfirm(address.id)}
										loading={removing}
										icon={<Trash2 size={18} />}
									/>
								</Flex>
							</Flex>
						))}
					</Flex>
				)}

				<Flex
					justify="center"
					className="w-[-webkit-fill-available] p-4 fixed bottom-0 border-t border-solid border-[#e5e5e5] bg-white"
				>
					<Button
						className="w-full flex items-center justify-center rounded-none text-sm px-4 py-6 font-bold border-none"
						onClick={handleAddAddress}
					>
						<Plus size={18} />
						Thêm địa chỉ giao hàng
					</Button>
				</Flex>
			</div>

			{/* Drawer add Address */}
			<Drawer
				open={state}
				styles={{
					wrapper: { height: '100%', width: '100%' },
				}}
				title="Địa chỉ giao hàng"
				onClose={onClose}
				className="[&_.ant-drawer-title]:flex [&_.ant-drawer-title]:justify-center [&_.ant-drawer-title]:items-center"
			>
				<AddressForm
					customer={customer}
					region={region}
					onClose={onClose}
					editingAddress={editingAddress}
				/>
			</Drawer>
		</Flex>
	);
};

export default AddressBookMobile;
