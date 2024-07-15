import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import DiscountCode from '@/modules/checkout/components/discount-code';
import CartTotals from '@/modules/common/components/cart-totals';
import { Cart } from '@medusajs/medusa';
import PaymentButton from '../../components/payment-button';

type Props = {
	cart: Omit<Cart, 'refunded_total' | 'refundable_amount'>;
};

const CheckoutSummary = ({ cart }: Props) => {
	return (
		<Flex className="flex-col">
			<Card className="">
				<div className="sticky top-0 flex lg:flex-col gap-y-8 py-8 lg:py-0 ">
					<div className="w-full bg-white flex flex-col">
						<Text className="flex flex-row text-lg items-baseline font-semibold">
							Tóm tắt đơn hàng
						</Text>
						<CartTotals data={cart!} />
					</div>
				</div>
			</Card>
			<Card className="mt-4">
				<div className="sticky top-0 flex lg:flex-col gap-y-8 py-8 lg:py-0 ">
					<div className="w-full bg-white flex flex-col">
						<Text className="flex flex-row text-lg items-baseline pb-4 font-semibold">
							Mã phiếu giảm giá
						</Text>
						<DiscountCode cart={cart!} />
					</div>
				</div>
			</Card>
			<PaymentButton />
		</Flex>
	);
};

export default CheckoutSummary;
