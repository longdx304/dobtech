import { getCart } from '@/actions/cart';
import { enrichLineItems } from '@/modules/cart/action';
import { LineItem } from '@medusajs/medusa';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
	title: 'CHAMDEP VN | Thanh toán',
	description: 'Thanh toán đơn hàng của bạn trên CHAMDEP VN',
};

const fetchCart = async () => {
	const cartId = cookies().get('_medusa_cart_id')?.value;

	if (!cartId) {
		return notFound();
	}

	const cart = await getCart(cartId).then((cart) => cart);

	if (cart?.items.length) {
		const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id);
		cart.items = enrichedItems as LineItem[];
	}

	return cart;
};

export default async function Checkout() {
	const cart = await fetchCart();

	if (!cart) {
		return notFound();
	}

	return (
		<div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
			{/* <CheckoutForm />
			<CheckoutSummary /> */}
		</div>
	);
}
