'use client';
import { Button } from '@/components/Button';
import { useStoreUpdateOrder } from '@/lib/hooks/api/order';
import { useStoreUploadFile } from '@/lib/hooks/api/uploads';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { deleteLineItem } from '@/modules/cart/action';
import ErrorMessage from '@/modules/common/components/error-message';
import { ERoutes } from '@/types/routes';
import { Cart, Customer, LineItem, Region } from '@medusajs/medusa';
import { intersection } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { placeOrder, removeGuestCart } from '../../actions';
import { generatePdfBlob } from '../order-pdf';

type Props = {
	data: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

export interface LineItemReq {
	variantId: string;
	quantity: number;
	unit_price?: number;
	title?: string;
}

export interface pdfOrderReq {
	isSendEmail?: boolean;
	lineItems: LineItemReq[];
	customer?: Pick<
		Customer,
		'last_name' | 'first_name' | 'email' | 'phone'
	> | null;
	address: string;
	totalQuantity: number;
	email: string;
	countryCode?: string;
	region: Region;
	metadata?: Record<string, unknown>;
}

const PaymentButton = ({ data }: Props) => {
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const cartId = useSearchParams().get('cartId') || '';
	const { cart, refreshCart } = useCart();
	const { customer } = useCustomer();

	const router = useRouter();
	const checkoutCartVariants = data?.items.map((item) => item.variant_id);
	const mainCartVariant = cart?.items.map((item) => item.variant_id);

	const uploadFile = useStoreUploadFile();
	const uploadOrder = useStoreUpdateOrder();

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

	const generateFilePdf = async (data: any) => {
		const address = `${data.shipping_address?.address_2 ?? ''}, ${
			data.shipping_address?.city ?? ''
		}, ${data.shipping_address?.province ?? ''}, ${
			data.shipping_address?.country_code ?? ''
		}`;

		const pdfReq = {
			isSendEmail: false,
			lineItems: data.items.map((item: LineItem) => ({
				variantId: item.variant_id,
				quantity: item.quantity,
				unit_price: item.unit_price,
				title: item.title,
			})),
			customer: {
				last_name: data.shipping_address?.last_name,
				first_name: data.shipping_address?.first_name,
				email: data.email,
				phone: data.shipping_address?.phone,
			},
			address: address,
			totalQuantity: data.items.reduce(
				(acc: number, i: LineItem) => acc + i.quantity,
				0
			),
			email: data.email,
			countryCode: data.region.country_code,
			region: data.region,
		};

		// Generate pdf blob
		const pdfBlob = await generatePdfBlob(pdfReq, data.region);

		// Create a File object
		const fileName = `purchase-order.pdf`;

		// Create a File object
		const files = new File([pdfBlob], fileName, {
			type: 'application/pdf',
		});

		// Upload pdf to s3 using Medusa uploads API
		const uploadRes = await uploadFile.mutateAsync({
			files,
			prefix: 'orders',
		});

		const pdfUrl = uploadRes.uploads[0].url;

		return pdfUrl;
	};

	/**
	 * Handles the completion of a payment by attempting to place an order.
	 *
	 * @return {Promise<void>} A promise that resolves when the order has been placed or an error has been handled.
	 */
	const onPaymentCompleted = async () => {
		try {
			const result = await placeOrder(cartId);
			if (result?.data) {
				const urlPdf = await generateFilePdf(result.data);
				await uploadOrder.mutateAsync({
					id: result.data.orderId,
					metadata: {
						files: [
							{
								url: urlPdf,
								name: 'Order PDF',
								created_at: new Date(),
							},
						],
					},
				});
			}
			if (result.redirect) {
				// remove guest cart if customer is not logged in but still complete payment
				!customer && (await removeGuestCart());
				router.push(result.url as any);
			} else {
				// Handle non-redirect case
				// if get error return dashboard
				router.push(`${ERoutes.HOME}`);
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
		<Suspense>
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
		</Suspense>
	);
};

export default PaymentButton;
