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

const countryCode = 'vn';

const CheckoutTemplate = async ({
	params,
}: {
	params?: { [key: string]: string | string[] | undefined };
}) => {
	const customer = await getCustomer();
	const region = await getRegion(countryCode);

	const cart = (await createPaymentSessions(params?.cartId as string).then(
		(cart) => cart
	)) as CartWithCheckoutStep;

	if (!cart) {
		return null;
	}

	cart.checkout_step = cart && getCheckoutStep(cart);

	if (!cart) {
		return notFound();
	}

	const availableShippingMethods = await listCartShippingMethods(cart.id).then(
		(methods) => methods?.filter((m) => !m.is_return)
	);

	if (!availableShippingMethods) {
		return null;
	}

	return (
		<div className="box-border flex flex-col gap-8">
			<CheckoutPreview
				cart={cart}
				customer={customer}
				region={region!}
				availableShippingMethods={availableShippingMethods}
			/>
		</div>
	);
};

export default CheckoutTemplate;
