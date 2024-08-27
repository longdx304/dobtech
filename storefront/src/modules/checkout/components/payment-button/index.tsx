'use client';
import { Button } from '@/components/Button';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { deleteLineItem } from '@/modules/cart/action';
import ErrorMessage from '@/modules/common/components/error-message';
import { ERoutes } from '@/types/routes';
import { Cart } from '@medusajs/medusa';
import { intersection } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { placeOrder, removeGuestCart } from '../../actions';

type Props = {
	data: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

const PaymentButton = ({ data }: Props) => {
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const cartId = useSearchParams().get('cartId') || '';
	const { cart, refreshCart } = useCart();
	const { customer } = useCustomer();

	const router = useRouter();
	const checkoutCartVariants = data?.items.map((item) => item.variant_id);
	const mainCartVariant = cart?.items.map((item) => item.variant_id);

	const _intersection = mainCartVariant
		? intersection(checkoutCartVariants, mainCartVariant)
		: checkoutCartVariants;

	/**
	 * Finds the line item IDs for the given variant IDs.
	 *
	 * @param {string[]} variantId - The array of variant IDs to find line item IDs for.
	 * @return {string[]} The array of line item IDs corresponding to the given variant IDs.
	 */
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

	const lineItemIds = findLineItemId(_intersection as string[]);

	/**
	 * Handles the completion of a payment by attempting to place an order.
	 *
	 * @return {Promise<void>} A promise that resolves when the order has been placed or an error has been handled.
	 */
	const onPaymentCompleted = async () => {
		try {
			const result = await placeOrder(cartId);
			if (result.redirect) {
				// remove guest cart if customer is not logged in but still complete payment
				!customer && (await removeGuestCart());
				router.push(result.url as any);
			} else {
				// Handle non-redirect case
				// if get error return dashboard
				router.push(`${ERoutes.DASHBOARD}`);
			}
		} catch (err: any) {
			setErrorMessage(err.toString());
			setSubmitting(false);
		}
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
			// handle case when customer is not logged in
			customer && cart && (await handleDeleteLineItem(lineItemIds as string[]));
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
				className="flex items-center justify-center w-full rounded-none text-lg uppercase mt-4 mb-5 font-bold"
				onClick={handleCheckout}
				loading={submitting}
			>
				Đặt hàng
			</Button>
			<ErrorMessage
				error={errorMessage}
				data-testid="manual-payment-error-message"
			/>
		</>
	);
};

export default PaymentButton;
