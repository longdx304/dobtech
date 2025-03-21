import { medusaClient } from '@/lib/database/config';
import { getMedusaHeaders } from './auth';
import { cache } from 'react';
import medusaError from '@/lib/utils/medusa-error';
import { removeGuestCart } from '@/modules/checkout/actions';

// Cache the payment session creation to prevent multiple calls
export const createPaymentSessions = cache(async (cartId: string) => {
	if (!cartId) return null;
	
	const headers = await getMedusaHeaders(['cart']);
	
	try {
		const { cart } = await medusaClient.carts.createPaymentSessions(cartId, headers);
		return cart;
	} catch (err) {
		console.error('Error creating payment sessions:', err);
		return null;
	}
});

export async function deletePaymentSession(
	cartId: string,
	provider_id: string
) {

	return medusaClient.carts
		.deletePaymentSession(cartId, provider_id)
		.then(({ cart }) => cart)
		.catch((err) => {
			console.log(err);
			return null;
		});
}

// Shipping actions
export const listCartShippingMethods = cache(async function (cartId: string) {
	const headers = await getMedusaHeaders(['shipping']);

	return medusaClient.shippingOptions
		.listCartOptions(cartId, headers)
		.then(({ shipping_options }) => {
			return shipping_options;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});
});

export async function addShippingMethod({
	cartId,
	shippingMethodId,
}: {
	cartId: string;
	shippingMethodId: string;
}) {
	const headers = await getMedusaHeaders(['cart']);

	return medusaClient.carts
		.addShippingMethod(cartId, { option_id: shippingMethodId }, headers)
		.then(({ cart }) => cart)
		.catch((err) => medusaError(err));
}

export async function deleteDiscount(cartId: string, code: string) {
	const headers = await getMedusaHeaders(['cart']);

	return medusaClient.carts
		.deleteDiscount(cartId, code, headers)
		.then(({ cart }) => cart)
		.catch((err) => {
			console.log(err);
			return null;
		});
}
