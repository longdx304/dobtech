import { getCart } from '@/actions/cart';
import { Card } from '@/components/Card';
import { Text } from '@/components/Typography';
import CartTotals from '@/modules/common/components/cart-totals';
import { cookies } from 'next/headers';

const CheckoutSummary = async () => {
	const cartId = cookies().get('_medusa_cart_id')?.value;

	if (!cartId) {
		return null;
	}

	const cart = await getCart(cartId).then((cart) => cart);

	if (!cart) {
		return null;
	}

	return (
		<Card className="h-fit sticky top-16">
			<div className="sticky top-0 flex lg:flex-col gap-y-8 py-8 lg:py-0 ">
				<div className="w-full bg-white flex flex-col">
					<Text className="flex flex-row text-lg items-baseline">
						Tóm tắt đơn hàng
					</Text>
					<CartTotals data={cart} />
				</div>
			</div>
		</Card>
	);
};

export default CheckoutSummary;