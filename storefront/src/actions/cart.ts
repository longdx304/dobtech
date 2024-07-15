import { medusaClient } from '@/lib/database/config';
import medusaError from '@/lib/utils/medusa-error';
import { StorePostCartReq, StorePostCartsCartReq } from '@medusajs/medusa';
import { cache } from 'react';
import { getMedusaHeaders } from './auth';

interface StoreUpdateCartsReq extends StorePostCartsCartReq {
	metadata?: Record<string, unknown>;
}

interface StorePostCartsReq extends StorePostCartReq {
	metadata?: Record<string, unknown>;
}

// Cart actions
export async function createCart(payload: StorePostCartsReq) {
	const headers = await getMedusaHeaders(['cart']);

	return medusaClient.carts
		.create(payload, headers)
		.then(({ cart }) => {
			return cart;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});
}

export async function updateCart(cartId: string, payload: StoreUpdateCartsReq) {
	const headers = await getMedusaHeaders(['cart']);

	return medusaClient.carts
		.update(cartId, payload, headers)
		.then(({ cart }) => {
			return cart;
		})
		.catch((error) => medusaError(error));
}

export const getCart = cache(async function (cartId: string) {
	const headers = await getMedusaHeaders(['cart']);

	return medusaClient.carts
		.retrieve(cartId, headers)
		.then(({ cart }) => cart)
		.catch((err) => {
			console.log(err);
			return null;
		});
});

export async function addItem({
	cartId,
	variantId,
	quantity,
}: {
	cartId: string;
	variantId: string;
	quantity: number;
}) {
	const headers = await getMedusaHeaders(['cart']);

	return medusaClient.carts.lineItems
		.create(cartId, { variant_id: variantId, quantity }, headers)
		.then(({ cart }) => {
			return cart;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});
}

export async function updateItem({
	cartId,
	lineId,
	quantity,
}: {
	cartId: string;
	lineId: string;
	quantity: number;
}) {
	const headers = await getMedusaHeaders(['cart']);

	return medusaClient.carts.lineItems
		.update(cartId, lineId, { quantity }, headers)
		.then(({ cart }) => cart)
		.catch((err) => medusaError(err));
}

export async function removeItem({
	cartId,
	lineId,
}: {
	cartId: string;
	lineId: string;
}) {
	const headers = await getMedusaHeaders(['cart']);

	return medusaClient.carts.lineItems
		.delete(cartId, lineId, headers)
		.then(({ cart }) => cart)
		.catch((err) => {
			console.log(err);
			return null;
		});
}

export async function completeCart(cartId: string) {
	const headers = await getMedusaHeaders(['cart']);

	return medusaClient.carts
		.complete(cartId, headers)
		.then((res) => {
			return res;
		})
		.catch((err) => medusaError(err));
}

// Order actions
export const retrieveOrder = cache(async function (id: string) {
	const headers = await getMedusaHeaders(['order']);

	return medusaClient.orders
		.retrieve(id, headers)
		.then(({ order }) => order)
		.catch((err) => medusaError(err));
});
