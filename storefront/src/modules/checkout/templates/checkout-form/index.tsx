'use client'
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useRegion } from '@/lib/providers/region-provider';
import { useCustomer } from '@/lib/providers/user/user-provider';
import Addresses from '@/modules/checkout/components/addresses';
import ItemsPreview from '@/modules/checkout/components/items-preview';
import PaymentOptions from '@/modules/checkout/components/payment-options';
import ShippingOptions from '@/modules/checkout/components/shipping-options';

export default function CheckoutForm() {
	const { selectedCartItems } = useCart();
	const { customer } = useCustomer();
	const { region } = useRegion();

	return (
		<div className="flex flex-col gap-4">
			{/* <Addresses
				cart={selectedCartItems}
				customer={customer}
				region={region!}
			/>
			<ItemsPreview items={selectedCartItems?.items} region={region!} />
			<ShippingOptions region={region!} />
			<PaymentOptions /> */}
			CheckoutForm
		</div>
	);
}
