'use client';
import { Button } from '@/components/Button';
import React, { useState } from 'react';
import { deleteCartCheckout, placeOrder } from '../../actions';
import { useSearchParams } from 'next/navigation';

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

	const handleClick = async () => {
		deleteCartCheckout(cartId);
	}
	

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

			<Button onClick={handleClick} className='mt-4'>
				Test
			</Button>
		</>
	);
};

export default PaymentButton;
