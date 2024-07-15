'use client';
import { Button } from '@/components/Button';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { placeOrder } from '../../actions';

const PaymentButton = () => {
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const cartId = useSearchParams().get('cartId') || '';

	const onPaymentCompleted = async () => {
		await placeOrder(cartId).catch((err) => {
			setErrorMessage(err.toString());
			setSubmitting(false);
		});
	};

	const handleCheckout = () => {
		setSubmitting(true);

		onPaymentCompleted();
	};

	return (
		<>
			<Button
				type="primary"
				block
				className="flex items-center justify-center w-full rounded-none text-lg uppercase mt-4 font-bold"
				onClick={handleCheckout}
				loading={submitting}
			>
				Đặt hàng
			</Button>
		</>
	);
};

export default PaymentButton;
