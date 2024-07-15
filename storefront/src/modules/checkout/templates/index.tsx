import { getCart } from '@/actions/cart';
import { getCustomer } from '@/actions/customer';
import { getRegion } from '@/actions/region';
import { enrichLineItems } from '@/modules/cart/action';
import { LineItem } from '@medusajs/medusa';
import { notFound } from 'next/navigation';
import CheckoutForm from './checkout-form';
import CheckoutSummary from './checkout-summary';

const countryCode = 'vn';

const fetchCart = async (params: string) => {
	const cartId = params;

	if (!cartId) {
		return notFound();
	}

	const cart = await getCart(cartId).then((cart) => cart);

	if (cart?.items.length) {
		const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id);
		cart.items = enrichedItems as LineItem[];
	}

	return cart;
};

const CheckoutTemplate = async ({
	params,
}: {
	params?: { [key: string]: string | string[] | undefined };
}) => {
	const cart = await fetchCart(params?.cartId as string);
	const customer = await getCustomer();
	const region = await getRegion(countryCode);

	if (!cart) {
		return notFound();
	}

	return (
		<div className="box-border flex flex-col gap-8">
			<div className="pt-4 container box-border flex flex-col gap-8">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_416px] gap-x-8">
					<CheckoutForm
						cartId={cart?.id}
						customer={customer}
						region={region!}
					/>
					<CheckoutSummary cart={cart} />
				</div>
			</div>
		</div>
	);
};

export default CheckoutTemplate;
