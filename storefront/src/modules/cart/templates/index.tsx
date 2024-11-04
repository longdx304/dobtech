import { getCart } from '@/actions/cart';
import { getCustomer } from '@/actions/customer';
import { getCheckoutStep } from '@/lib/utils/get-checkout-step';
import { enrichLineItems } from '@/modules/cart/action';
import ProductList from '@/modules/products/components/product-list';
import { CartWithCheckoutStep } from '@/types/medusa';
import { LineItem } from '@medusajs/medusa';
import { cookies } from 'next/headers';

import CartPreview from './cart-preview';

type Props = {};

const fetchCart = async () => {
	const cartId = cookies().get('_chamdep_cart_id')?.value;

	if (!cartId) {
		return null;
	}

	const cart = await getCart(cartId).then(
		(cart) => cart as CartWithCheckoutStep
	);

	if (!cart) {
		return null;
	}

	if (cart?.items.length) {
		const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id);
		cart.items = enrichedItems as LineItem[];
	}

	cart.checkout_step = cart && getCheckoutStep(cart);

	return cart;
};

const CartTemplate = async ({}: Props) => {
	const cart = await fetchCart();
	const customer = await getCustomer();

	return (
		<>
			{/* CartTemplate */}
			<div className="pt-4 container box-border flex flex-col gap-8">
				<CartPreview cart={cart!} customer={customer} />
				<div className="flex-col space-y-2">
					<h2 className="w-full h-[50px] flex justify-center items-center bg-[#f6f6f6] mt-0 text-sm">
						⬥ Bạn có lẽ cũng thích ⬥
					</h2>
					<div className="px-4 lg:pb-16 pb-4">
						<ProductList />
					</div>
				</div>
			</div>
		</>
	);
};

export default CartTemplate;
