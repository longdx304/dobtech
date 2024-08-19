import { Cart, LineItem } from '@medusajs/medusa';
import { createCheckoutCart } from '@/modules/cart/action';
import { addToCheckout } from '@/modules/cart/action';

const countryCode = 'vn';

/**
 * Creates and populates a new checkout cart with the given items.
 *
 * @param {LineItem[]} items - The items to add to the new checkout cart.
 * @return {Promise<Cart>} The newly created and populated checkout cart.
 */
export const createAndPopulateCheckoutCart = async (
	items: LineItem[]
): Promise<Cart> => {
	const newCart = await createCheckoutCart(countryCode);
	if (!newCart) {
		throw new Error('Failed to create checkout cart');
	}
	await Promise.all(
		items.map((item) =>
			addToCheckout({
				cartId: newCart.id,
				variantId: item.variant_id!,
				quantity: item.quantity,
			})
		)
	);
	return newCart as Cart;
};

/**
 * Finds the checkout cart from the list of all carts.
 *
 * @param {Cart[]} allCarts - The list of all carts.
 * @param {string | undefined} customerEmail - The email of the customer (optional).
 * @return {Cart | undefined} The found checkout cart or undefined if not found.
 */
export const findCheckoutCart = (
	allCarts: Cart[],
	customerEmail?: string
): Cart | undefined => {
	const result = allCarts.find(
		(cart) =>
			cart?.metadata?.cart_type === 'checkout' &&
			cart?.payment_id === null &&
			cart?.email === customerEmail
	);
	return result;
};
