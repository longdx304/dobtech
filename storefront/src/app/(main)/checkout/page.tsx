import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { LineItem } from '@medusajs/medusa';
import { getCart } from '@/actions/cart';
import { enrichLineItems } from '@/modules/cart/action';
import React, { Suspense } from 'react';
import CheckoutSkeleton from './skeleton';

const CheckoutTemplate = React.lazy(() => import('@/modules/checkout/templates'));

export const metadata: Metadata = {
	title: 'Checkout',
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
		<div className="w-full pt-[6rem] lg:pt-[4rem]">
			<Suspense fallback={<CheckoutSkeleton />}>
				<CheckoutTemplate />
			</Suspense>
		</div>
	);
}
