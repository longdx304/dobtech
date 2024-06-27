import { getCart } from '@/actions/cart';
import { enrichLineItems } from '@/modules/cart/action';
import { LineItem } from '@medusajs/medusa';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import React from 'react';
import CheckoutForm from './checkout-form';
import CheckoutSummary from './checkout-summary';
import StepsOrder from '@/modules/cart/components/steps-order';

type Props = {};

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

const CheckoutTemplate = async ({}: Props) => {
	const cart = await fetchCart();

	if (!cart) {
		return notFound();
	}

	return (
		<div className="pt-4 container box-border flex flex-col gap-8">
			<StepsOrder />
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_416px] gap-x-40 pt-[2rem]">
				<CheckoutForm />
				<CheckoutSummary />
			</div>
		</div>
	);
};

export default CheckoutTemplate;
