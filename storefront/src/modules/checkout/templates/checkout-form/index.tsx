import {
	createPaymentSessions,
	listCartShippingMethods,
} from '@/actions/checkout';
import { getCheckoutStep } from '@/lib/utils/get-checkout-step';
import Addresses from '@/modules/checkout/components/addresses';
import ItemsPreview from '@/modules/checkout/components/items-preview';
import PaymentOptions from '@/modules/checkout/components/payment-options';
import ShippingOptions from '@/modules/checkout/components/shipping-options';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Customer, Region } from '@medusajs/medusa';

type Props = {
	cartId: string;
	customer: Omit<Customer, 'password_hash'> | null;
	region: Region | null;
};

export default async function CheckoutForm({
	cartId,
	customer,
	region,
}: Props) {
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

	return (
		<div className="flex flex-col gap-4">
			<Addresses cart={cart} customer={customer} region={region!} />
			<ItemsPreview cart={cart} region={region!} />
			<ShippingOptions
				region={region!}
				availableShippingMethods={availableShippingMethods}
			/>
			<PaymentOptions />
		</div>
	);
}
