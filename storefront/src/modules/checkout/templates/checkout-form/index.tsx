import { Card } from '@/components/Card';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useRegion } from '@/lib/providers/region-provider';
import { useCustomer } from '@/lib/providers/user/user-provider';
import PaymentOptions from '@/modules/checkout/components/payment-options';
import ShippingOptions from '@/modules/checkout/components/shipping-options';
import Addresses from '../../components/addresses';

export default function CheckoutForm() {
	const { cart } = useCart();
	const { customer } = useCustomer();
	const { region } = useRegion();

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<Addresses cart={cart} customer={customer} region={region!} />
			</Card>
			<ShippingOptions region={region!} />
			<PaymentOptions />
		</div>
	);
}
