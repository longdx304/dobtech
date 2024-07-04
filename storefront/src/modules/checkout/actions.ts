'use server';

import { completeCart, updateCart } from '@/actions/cart';
import { deleteDiscount } from '@/actions/checkout';
import { GiftCard, StorePostCartsCartReq } from '@medusajs/medusa';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function setAddresses(values: any, email?: string) {
	const cartId = cookies().get('_medusa_cart_id')?.value;

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

	console.log('data', data);

	try {
		await updateCart(cartId, data);
		revalidateTag('cart');
	} catch (error: any) {
		return error.toString();
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

export async function placeOrder() {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) throw new Error("No cartId cookie found")

  let cart

  try {
    cart = await completeCart(cartId)
		console.log('cart', cart)
    revalidateTag("cart")
  } catch (error: any) {
    throw error
  }

  // if (cart?.type === "order") {
  //   cookies().set("_medusa_cart_id", "", { maxAge: -1 })
  // }

  return cart
}
