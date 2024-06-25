import { createPaymentSessions, listCartShippingMethods } from '@/actions/checkout';
import { getCustomer } from '@/actions/customer';
import { getCheckoutStep } from '@/lib/utils/get-checkout-step';
import { CartWithCheckoutStep } from '@/types/medusa';
import { cookies } from 'next/headers';

export default async function CheckoutForm() {
	const cartId = cookies().get('_medusa_cart_id')?.value;

	if (!cartId) {
		return null;
	}

	// create payment sessions and get cart
	const cart = (await createPaymentSessions(cartId).then(
		(cart) => cart
	)) as CartWithCheckoutStep;

	if (!cart) {
		return null;
	}

	cart.checkout_step = cart && getCheckoutStep(cart);

	// get available shipping methods
	const availableShippingMethods = await listCartShippingMethods(cart.id).then(
		(methods) => methods?.filter((m) => !m.is_return)
	);

	if (!availableShippingMethods) {
		return null;
	}

	// get customer if logged in
	const customer = await getCustomer();

	return (
		<div>
			{/* Addresses
      Shipping
      Payment
			 */}
		</div>
	);
}
