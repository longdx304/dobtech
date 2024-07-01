import { Card } from '@/components/Card';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useRegion } from '@/lib/providers/region-provider';
import { useCustomer } from '@/lib/providers/user/user-provider';
import PaymentOptions from '@/modules/checkout/components/payment-options';
import ShippingOptions from '@/modules/checkout/components/shipping-options';
import ItemsPreview from '@/modules/checkout/components/items-preview';
import Addresses from '@/modules/checkout/components/addresses';

export default function CheckoutForm() {
	const { cart, selectedCartItems } = useCart();
	const { customer } = useCustomer();
	const { region } = useRegion();

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<Addresses cart={cart} customer={customer} region={region!} />
			</Card>
			<ItemsPreview items={selectedCartItems?.items} region={region!} />
			<ShippingOptions region={region!} />
			<PaymentOptions />
		</div>
	);
}
