import { Card } from '@/components/Card';
import { Text } from '@/components/Typography';
import { useCart } from '@/lib/providers/cart/cart-provider';
import CartTotals from '@/modules/common/components/cart-totals';

const CheckoutSummary = () => {
	const { selectedCartItems } = useCart();

	return (
		<Card className="h-fit sticky top-16">
			<div className="sticky top-0 flex lg:flex-col gap-y-8 py-8 lg:py-0 ">
				<div className="w-full bg-white flex flex-col">
					<Text className="flex flex-row text-lg items-baseline">
						Tóm tắt đơn hàng
					</Text>
					<CartTotals data={selectedCartItems} />
				</div>
			</div>
		</Card>
	);
};

export default CheckoutSummary;
