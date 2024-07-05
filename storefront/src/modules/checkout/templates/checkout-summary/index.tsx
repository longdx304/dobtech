'use client'
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { useCart } from '@/lib/providers/cart/cart-provider';
import DiscountCode from '@/modules/checkout/components/discount-code';
import CartTotals from '@/modules/common/components/cart-totals';
import { placeOrder } from '../../actions';
import { useState } from 'react';
import { useCompleteCart, useCreatePaymentSession } from 'medusa-react';

const CheckoutSummary = () => {
	const { selectedCartItems } = useCart();
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const createPaymentSession = useCreatePaymentSession(selectedCartItems?.id || '');

	const handleComplete = () => {
		createPaymentSession.mutate(void 0, {
			onSuccess: ({ cart }) => {
				console.log(cart.payment_sessions);
			},
		});
	};

	const onPaymentCompleted = async () => {
		await placeOrder().catch((err) => {
			setErrorMessage(err.toString());
			setSubmitting(false);
		});
	};

	// const completeCart = useCompleteCart(selectedCartItems?.id || '');

  // const onPaymentCompleted = () => {
  //   completeCart.mutate(void 0, {
  //     onSuccess: ({ data, type }) => {
  //       console.log(data.id, type)
  //     }
  //   })
	// 	setSubmitting(false);
  // }

	const handleCheckout = () => {
		handleComplete();
		setSubmitting(true);

		onPaymentCompleted();
		console.log('checkout complete');
	};
	console.log('selectedCartItems', selectedCartItems);

	return (
		<Flex className="flex-col">
			{/* <Card className="">
				<div className="sticky top-0 flex lg:flex-col gap-y-8 py-8 lg:py-0 ">
					<div className="w-full bg-white flex flex-col">
						<Text className="flex flex-row text-lg items-baseline font-semibold">
							Tóm tắt đơn hàng
						</Text>
						<CartTotals data={selectedCartItems!} />
					</div>
				</div>
			</Card>
			<Card className="mt-4">
				<div className="sticky top-0 flex lg:flex-col gap-y-8 py-8 lg:py-0 ">
					<div className="w-full bg-white flex flex-col">
						<Text className="flex flex-row text-lg items-baseline pb-4 font-semibold">
							Mã phiếu giảm giá
						</Text>
						<DiscountCode cart={selectedCartItems!} />
					</div>
				</div>
			</Card>
			<Button
				type="primary"
				block
				className="flex items-center justify-center w-full rounded-none text-lg uppercase mt-4 font-bold"
				onClick={handleCheckout}
				loading={submitting}
			>
				Đặt hàng
			</Button> */}
			CheckoutSummary
		</Flex>
	);
};

export default CheckoutSummary;
