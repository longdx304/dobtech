import { useCart } from '@/lib/providers/cart/cart-provider';
import Addresses from '../../components/addresses';
import ShippingOptions from '@/modules/checkout/components/shipping-options';
import PaymentOptions from '@/modules/checkout/components/payment-options';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { Card } from '@/components/Card';
import { getRegion } from '@/actions/region';

export default async function CheckoutForm() {
	const { cart } = useCart();
	const { customer } = useCustomer();

	const region = await getRegion('vn');

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<Addresses cart={cart} customer={customer} />
			</Card>
			<ShippingOptions region={region} />
			<PaymentOptions />
		</div>
	);
}
