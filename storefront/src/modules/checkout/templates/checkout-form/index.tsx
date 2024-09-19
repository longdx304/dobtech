import { Cart, Customer, Region } from '@medusajs/medusa';
import { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
import Addresses from '@/modules/checkout/components/addresses';
import ItemsPreview from '@/modules/checkout/components/items-preview';
import PaymentOptions from '@/modules/checkout/components/payment-options';
import ShippingOptions from '@/modules/checkout/components/shipping-options';

// const Addresses = dynamic(
// 	() => import('@/modules/checkout/components/addresses'),
// 	{
// 		ssr: false,
// 	}
// );
// const ItemsPreview = dynamic(
// 	() => import('@/modules/checkout/components/items-preview'),
// 	{
// 		ssr: false,
// 	}
// );
// const PaymentOptions = dynamic(
// 	() => import('@/modules/checkout/components/payment-options'),
// 	{
// 		ssr: false,
// 	}
// );
// const ShippingOptions = dynamic(
// 	() => import('@/modules/checkout/components/shipping-options'),
// 	{
// 		ssr: false,
// 	}
// );


type Props = {
	cart: Omit<Cart, 'refunded_total' | 'refundable_amount'>;
	customer: Omit<Customer, 'password_hash'> | null;
	region: Region | null;
	availableShippingMethods: PricedShippingOption[] | null;
};

export default function CheckoutForm({
	cart,
	customer,
	region,
	availableShippingMethods,
}: Props) {
	return (
		<div className="flex flex-col gap-4">
			<Addresses cart={cart} customer={customer} region={region!} />
			<ItemsPreview cart={cart} region={region!} />
			<ShippingOptions
				region={region!}
				availableShippingMethods={availableShippingMethods}
			/>
			<PaymentOptions cart={cart} />
		</div>
	);
}
