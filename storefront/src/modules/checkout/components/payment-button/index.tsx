'use client';
import { Button } from '@/components/Button';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { deleteLineItem } from '@/modules/cart/action';
import { Cart } from '@medusajs/medusa';
import _ from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { placeOrder } from '../../actions';

type Props = {
	data: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

const PaymentButton = ({ data }: Props) => {
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const cartId = useSearchParams().get('cartId') || '';
	const { cart, refreshCart } = useCart();

	const checkoutCartVariants = data?.items.map((item) => item.variant_id);
	const mainCartVariant = cart?.items.map((item) => item.variant_id);

	const intersection = mainCartVariant
		? _.intersection(checkoutCartVariants, mainCartVariant)
		: checkoutCartVariants;

	const findLineItemId = (variantId: string[]) => {
		const result = variantId.map((variant) => {
			if (cart?.items) {
				return cart?.items.find((item) => item.variant_id === variant);
			} else {
				return data?.items.find((item) => item.variant_id === variant);
			}
		});

		const lineItemIds = result.map((item) => item?.id);
		return lineItemIds;
	};

	const lineItemIds = findLineItemId(intersection as string[]);

	const onPaymentCompleted = async () => {
		await placeOrder(cartId).catch((err) => {
			setErrorMessage(err.toString());
			setSubmitting(false);
		});
	};

	const handleDeleteLineItem = async (lineItemIds: string[]) => {
		try {
			await Promise.all(
				lineItemIds.map(async (id) => {
					await deleteLineItem(id);
				})
			);
			refreshCart();
		} catch (err: any) {
			setErrorMessage(err.toString());
		} finally {
			setSubmitting(false);
		}
	};

	const handleCheckout = async () => {
		setSubmitting(true);

		try {
			// delete line items from cart checkout with cart main 
			cart && await handleDeleteLineItem(lineItemIds as string[]);
			await onPaymentCompleted();
		} catch (err: any) {
			setErrorMessage(err.toString());
		}
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
