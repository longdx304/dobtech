'use server';

import { completeCart, updateCart } from '@/actions/cart';
import { addShippingMethod, deleteDiscount } from '@/actions/checkout';
import { BACKEND_URL } from '@/lib/constants';
import { GiftCard, StorePostCartsCartReq } from '@medusajs/medusa';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setAddresses(
	values: any,
	email?: string,
	cartId?: string
) {
	if (!cartId) return { message: 'Không tìm thấy sản phẩm' };

	const data = {
		shipping_address: {
			first_name: values.firstName,
			last_name: values.lastName,
			phone: values.phone,
			address_1: values.ward,
			address_2: values.address,
			city: values.district,
			province: values.province,
			postal_code: values.postalCode,
			country_code: values.countryCode,
		},
		email: email ? email : 'anonymous@gmail.com',
	} as StorePostCartsCartReq;

	try {
		await updateCart(cartId, data);
		revalidateTag('cart');
	} catch (error: any) {
		return error.toString();
	}
}

export async function setShippingMethod(
	shippingMethodId: string,
	cartId?: string
) {
	if (!cartId) throw new Error('Không tìm thấy sản phẩm');

	try {
		await addShippingMethod({ cartId, shippingMethodId });
		revalidateTag('cart');
	} catch (error: any) {
		throw error;
	}
}

export async function applyDiscount(code: string) {
	const cartId = cookies().get('_medusa_cart_id')?.value;

	if (!cartId) return 'No cartId cookie found';

	try {
		await updateCart(cartId, { discounts: [{ code }] }).then(() => {
			revalidateTag('cart');
		});
	} catch (error: any) {
		throw error;
	}
}

export async function applyGiftCard(code: string) {
	const cartId = cookies().get('_medusa_cart_id')?.value;

	if (!cartId) return 'No cartId cookie found';

	try {
		await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
			revalidateTag('cart');
		});
	} catch (error: any) {
		throw error;
	}
}

export async function removeDiscount(code: string) {
	const cartId = cookies().get('_medusa_cart_id')?.value;

	if (!cartId) return 'No cartId cookie found';

	try {
		await deleteDiscount(cartId, code);
		revalidateTag('cart');
	} catch (error: any) {
		throw error;
	}
}

export async function removeGiftCard(
	codeToRemove: string,
	giftCards: GiftCard[]
) {
	const cartId = cookies().get('_medusa_cart_id')?.value;

	if (!cartId) return 'No cartId cookie found';

	try {
		await updateCart(cartId, {
			gift_cards: [...giftCards]
				.filter((gc) => gc.code !== codeToRemove)
				.map((gc) => ({ code: gc.code })),
		}).then(() => {
			revalidateTag('cart');
		});
	} catch (error: any) {
		throw error;
	}
}

export async function submitDiscountForm(values: any) {
	const code = values.code;

	try {
		await applyDiscount(code).catch(async (err) => {
			await applyGiftCard(code);
		});
		return null;
	} catch (error: any) {
		throw error;
	}
}

export async function placeOrder(cartId?: string) {
	if (!cartId) throw new Error('Không tìm thấy sản phẩm');

	let cart;

	try {
		cart = await completeCart(cartId);
		revalidateTag('cart');
	} catch (error: any) {
		throw error;
	}

	if (cart?.type === 'order') {
		redirect(`/order/confirmed/${cart?.data.id}`);
	}

	return cart;
}

export async function listAllCart() {
  try {
    const response = await fetch(`${BACKEND_URL}/store/cart`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch carts');
    }

		const data = await response.json();
		return data.carts;
  } catch (error: any) {
    throw error;
  }
}


export async function deleteCartCheckout(cartId?: string) {
	if (!cartId) throw new Error('Không tìm thấy sản phẩm');

	try {
		await fetch(`${BACKEND_URL}/store/cart?cartId=${cartId}`, {
			method: 'DELETE',
		});
	} catch (error: any) {
		throw error;
	}
}

export async function updateCartMetadata(
	cartId?: string,
	key?: string,
	value?: string | number
) {
	if (!cartId) throw new Error('Không tìm thấy sản phẩm');

	try {
		await fetch(
			`${BACKEND_URL}/store/cart/metadata?cartId=${cartId}&key=${key}&value=${value}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error: any) {
		throw error;
	}
}
