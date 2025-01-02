import {
	createPaymentSessions,
	listCartShippingMethods,
} from '@/actions/checkout';
import { getCustomer } from '@/actions/customer';
import { getRegion } from '@/actions/region';
import { getCheckoutStep } from '@/lib/utils/get-checkout-step';
import { CartWithCheckoutStep } from '@/types/medusa';
import { notFound } from 'next/navigation';
import CheckoutPreview from './checkout-preview';
import { cookies } from 'next/headers';
import { getCart } from '@/actions/cart';
import { cache } from 'react';

const countryCode = 'vn';

// Cache the checkout data fetching
const getCheckoutData = cache(async (cartId: string) => {
	if (!cartId) {
		return null;
	}

	// Get initial cart state
	const cart = await getCart(cartId);
	if (!cart) {
		return null;
	}

	// Only create payment sessions if needed
	const cartWithPayments = (!cart.payment_sessions?.length || !cart.payment_session)
		? await createPaymentSessions(cartId)
		: cart;

	if (!cartWithPayments) {
		return null;
	}

	// Fetch all required data in parallel
	const [customer, region, shippingMethods] = await Promise.all([
		getCustomer(),
		getRegion(countryCode),
		listCartShippingMethods(cartWithPayments.id)
	]);

	return {
		cart: {
			...cartWithPayments,
			checkout_step: getCheckoutStep(cartWithPayments)
		} as CartWithCheckoutStep,
		customer,
		region,
		shippingMethods: shippingMethods?.filter(m => !m.is_return) ?? []
	};
});

const CheckoutTemplate = async ({
	params,
}: {
	params?: { [key: string]: string | string[] | undefined };
}) => {
	const cartId = params?.cartId as string || cookies().get('_chamdep_cart_id')?.value;
	
	if (!cartId) {
		return notFound();
	}

	const data = await getCheckoutData(cartId);
	
	if (!data || !data.shippingMethods.length) {
		return null;
	}

	return (
		<div className="box-border flex flex-col gap-8">
			<CheckoutPreview
				cart={data.cart}
				customer={data.customer}
				region={data.region!}
				availableShippingMethods={data.shippingMethods}
			/>
		</div>
	);
};

export default CheckoutTemplate;
