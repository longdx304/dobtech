'use client';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useCart } from '@/lib/providers/cart/cart-provider';
import AddressForm from '@/modules/common/components/address-form';
import { Address, Cart, Customer, Region } from '@medusajs/medusa';
import { ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setAddresses } from '../../actions';
import AddressSelect from '../address-select';
import ShippingAddress from '../shipping-address';

const countryCode = 'vn';

const Addresses = ({
	cart,
	customer,
	region,
}: {
	cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
	customer: Omit<Customer, 'password_hash'> | null;
	region: Region;
}) => {
	const { state, onOpen, onClose: onAddressClose } = useToggleState(false);
	const { selectedAddress, setSelectedAddress } = useCart();

	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

	const handleEditAddress = (address: Address) => {
		setEditingAddress(address);
		onOpen();
	};

	/**
	 * Handles the edit action for the address.
	 * If an address is currently being edited, it is cleared.
	 * Then, the modal for editing an address is opened.
	 */
	const handleEdit = () => {
		if (editingAddress) {
			setEditingAddress(null);
		}
		onOpen();
	};

	// get countries in current region
	const countriesInRegion = useMemo(
		() => cart?.region.countries.map((c: any) => c.iso_2),
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

	// if selected address is not selected, select the first address
	const defaultAddress: Address | null = useMemo(() => {
		return (
			addressesInRegion?.find(
				(address) => address.metadata?.is_default === true
			) || null
		);
	}, [addressesInRegion]);

	/**
	 * Checks if an address is valid.
	 *
	 * @param {Address} address - The address to be checked.
	 * @return {boolean} True if the address is valid, false otherwise.
	 */
	const hasValidAddress = (address: Address | null) => {
		return (
			address &&
			address.address_1 &&
			address.city &&
			address.province &&
			address.first_name &&
			address.last_name
		);
	};

	// display address
	const displayAddress =
		selectedAddress ||
		defaultAddress ||
		(cart?.shipping_address && hasValidAddress(cart.shipping_address)
			? cart.shipping_address
			: null);

	/**
	 * Updates the cart's address with the default address if it exists.
	 *
	 * @return {Promise<void>} A promise that resolves when the address is updated. If there is an error, it will be logged to the console.
	 */
	const updateCartAddress = useCallback(async () => {
		try {
			if (!cart || !defaultAddress) return;

			await setAddresses(
				{
					firstName: defaultAddress.first_name!,
					lastName: defaultAddress.last_name!,
					phone: defaultAddress.phone!,
					ward: defaultAddress.address_1!,
					address: defaultAddress.address_2!,
					district: defaultAddress.city!,
					province: defaultAddress.province!,
					postalCode: defaultAddress.postal_code!,
					countryCode: defaultAddress.country_code!,
				},
				customer?.email,
				cart?.id
			);
		} catch (error) {
			console.log('error', error);
		}
	}, [cart, defaultAddress, customer]);

	useEffect(() => {
		updateCartAddress();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Card>
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

			{/* Display address if has the customer otherwise open form to fill */}
			{!!cart?.email && displayAddress ? (
				<Card className="shadow-none">
					<Flex className="flex-col" gap={4}>
						<Flex gap={10} align="baseline">
							<Text className="font-bold">
								{displayAddress?.first_name} {displayAddress?.last_name}
							</Text>
							<Text className="text-[#666666] text-[13px]">
								{displayAddress?.phone}
							</Text>
						</Flex>
						<Text className="text-[12px]">{displayAddress?.address_2}</Text>
						<Text className="text-[12px] w-[300px]">
							{displayAddress?.address_1}, {displayAddress?.city},
							{displayAddress?.province} {displayAddress?.postal_code}
						</Text>
						<Flex gap={8} className="absolute bottom-2 right-5">
							<Button
								type="link"
								onClick={() => handleEditAddress(displayAddress)}
								className="text-[12px] text-[#2d68a8] p-0"
							>
								Chỉnh Sửa
							</Button>
						</Flex>
					</Flex>
				</Card>
			) : (
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
							customer={customer}
							region={region}
							onClose={onAddressClose}
							editingAddress={editingAddress}
						/>
					</div>
				) : (
					<AddressSelect
						cart={cart}
						region={region}
						onAddressClose={onAddressClose}
					/>
				)}
			</Modal>
		</Card>
	);
};

export default Addresses;
