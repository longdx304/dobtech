'use client';
import { useCart } from '@/lib/providers/cart/cart-provider';
import StepsOrder from '@/modules/cart/components/steps-order';
import { Cart, Customer, Region } from '@medusajs/medusa';
import { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
import CheckoutForm from '../checkout-form';
import CheckoutSummary from '../checkout-summary';

type Props = {
	cart: Omit<Cart, 'refunded_total' | 'refundable_amount'>;
	customer: Omit<Customer, 'password_hash'> | null;
	region: Region;
	availableShippingMethods: PricedShippingOption[] | null;
};

export default function CheckoutPreview({
	cart,
	customer,
	region,
	availableShippingMethods,
}: Props) {
	const { currentStep } = useCart();

	return (
		<div className="pt-4 container box-border flex flex-col gap-8">
			{currentStep > 0 && <StepsOrder currentStep={currentStep} />}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_416px] gap-x-8">
				<CheckoutForm
					cart={cart}
					customer={customer}
					region={region!}
					availableShippingMethods={availableShippingMethods!}
				/>
				<CheckoutSummary cart={cart} />
			</div>
		</div>
	);
}
