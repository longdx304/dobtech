import ProductList from '@/modules/products/components/product-list';
import { CartWithCheckoutStep } from '@/types/medusa';
import { ProductPreviewType } from '@/types/product';
import { Customer, Region } from '@medusajs/medusa';
import Overview from './overview';
import StepsOrder from '@/modules/cart/components/steps-order';
import { cookies } from 'next/headers';
import { getCart } from '@/actions/cart';
import { enrichLineItems } from '@/modules/cart/action';
import { LineItem } from '@medusajs/medusa';
import { CartWithCheckoutStep } from '@/types/medusa';
import { getCheckoutStep } from '@/lib/utils/get-checkout-step';
import { getCustomer } from '@/actions/customer';
import { getProductsList } from '@/actions/products';
import { getRegion } from '@/actions/region';

type Props = {
	// cart: CartWithCheckoutStep | null;
	// customer: Omit<Customer, 'password_hash'> | null;
	// products: {
	// 	products: ProductPreviewType[];
	// 	count: number;
	// };
	// region: Region;
};

const fetchCart = async () => {
	const cartId = cookies().get('_medusa_cart_id')?.value;

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

const CartTemplate = async ({ }: Props) => {
	const cart = await fetchCart();
	const customer = await getCustomer();

	const { response: products } = await getProductsList({
		pageParam: 0,
	} as any);

	const region = await getRegion('vn');

	return (
		<div className="pt-4 container box-border flex flex-col gap-8">
			<StepsOrder />
			<Overview cart={cart} customer={customer} className='pb-12' />
			<div className="flex-col space-y-2">
				<h2 className="w-full h-[50px] flex justify-center items-center bg-[#f6f6f6] mt-0 text-sm">
					⬥ Bạn có lẽ cũng thích ⬥
				</h2>
				<div className="px-4 lg:pb-16 pb-4">
					<ProductList data={products} region={region} />
				</div>
			</div>
		</div>
	);
};

export default CartTemplate;
