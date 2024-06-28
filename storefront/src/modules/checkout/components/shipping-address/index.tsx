import { Card } from '@/components/Card';
import { InputWithLabel } from '@/components/Input';
import { Text } from '@/components/Typography';
import { Cart, Customer } from '@medusajs/medusa';
import React, { useEffect, useMemo, useState } from 'react';
import AddressSelect from '../address-select';

const ShippingAddress = ({
	customer,
	cart,

	countryCode,
}: {
	customer: Omit<Customer, 'password_hash'> | null;
	cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;

	countryCode: string;
}) => {
	const [formData, setFormData] = useState({
		'shipping_address.first_name': cart?.shipping_address?.first_name || '',
		'shipping_address.last_name': cart?.shipping_address?.last_name || '',
		'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
		'shipping_address.company': cart?.shipping_address?.company || '',
		'shipping_address.postal_code': cart?.shipping_address?.postal_code || '',
		'shipping_address.city': cart?.shipping_address?.city || '',
		'shipping_address.country_code':
			cart?.shipping_address?.country_code || countryCode || '',
		'shipping_address.province': cart?.shipping_address?.province || '',
		email: cart?.email || '',
		'shipping_address.phone': cart?.shipping_address?.phone || '',
	});

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
		setFormData({
			'shipping_address.first_name': cart?.shipping_address?.first_name || '',
			'shipping_address.last_name': cart?.shipping_address?.last_name || '',
			'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
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

	return (
		<>
			{customer && (addressesInRegion?.length || 0) > 0 ? (
				<Card className="mb-6 flex flex-col gap-y-4 p-5">
					<AddressSelect addresses={customer.shipping_addresses} cart={cart} />
				</Card>
			) : (
				<>123</>
			)}
		</>
	);
};

export default ShippingAddress;
