import { Metadata } from 'next';

import CartTemplate from '@/modules/cart/templates';
import { cookies } from 'next/headers';
import { getCart } from '@/actions/cart';
import { enrichLineItems } from '@/modules/cart/action';
import { LineItem } from '@medusajs/medusa';
import { CartWithCheckoutStep } from '@/types/medusa';
import { getCheckoutStep } from '@/lib/utils/get-checkout-step';
import { getCustomer } from '@/actions/customer';
import { getProductsList } from '@/actions/products';
import { getRegion } from '@/actions/region';

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Giỏ hàng',
	description: 'Giỏ hàng của bạn trên CHAMDEP VN',
};

const fetchCart = async () => {
	const cartId = cookies().get('_medusa_cart_id')?.value;

	if (!cartId) {
		return null;
	}

	const cart = await getCart(cartId).then(
		(cart) => cart as CartWithCheckoutStep
	);

	if (!cart) {
		return null;
	}

	if (cart?.items.length) {
		const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id);
		cart.items = enrichedItems as LineItem[];
	}

	cart.checkout_step = cart && getCheckoutStep(cart);

	return cart;
};

export default async function Cart() {
	const cart = await fetchCart();
	const customer = await getCustomer();

	const { response } = await getProductsList({
		pageParam: 0,
	} as any);

	const region = await getRegion('vn');

	return (
		<div className="w-full container pt-[6rem] lg:pt-[8rem]">
			<CartTemplate
				cart={cart}
				customer={customer}
				products={response}
				region={region!}
			/>
		</div>
	);
}
