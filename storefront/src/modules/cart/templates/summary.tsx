'use client';

import { Button } from '@/components/Button';
import { Text } from '@/components/Typography';
import { useCart } from '@/lib/providers/cart/cart-provider';
import CartTotals from '@/modules/common/components/cart-totals';
import { CartWithCheckoutStep } from '@/types/medusa';
import { ERoutes } from '@/types/routes';
import { Cart } from '@medusajs/medusa';
import { message, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addToCheckout, createCheckoutCart } from '../action';

type SummaryProps = {
	cart: CartWithCheckoutStep;
	selectedItems: string[];
};

const countryCode = 'vn';

const Summary = ({ cart, selectedItems }: SummaryProps) => {
	const { refreshCart, allCarts, deleteAndRefreshCart, setCurrentStep } =
		useCart();
	const [isAdding, setIsAdding] = useState(false);
	const router = useRouter();
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [checkoutCart, setCheckoutCart] = useState<Cart | undefined>(undefined);

	const selectedCartItems = cart.items.filter((item) =>
		selectedItems.includes(item.id)
	);

	const subtotal = selectedCartItems.reduce(
		(acc, item) => acc + (item.subtotal || 0),
		0
	);

	const discount_total = selectedCartItems.reduce(
		(acc, item) => acc + (item.discount_total || 0),
		0
	);

	const shipping_total = selectedCartItems.reduce(
		(acc, item) => acc + (item.shipped_quantity || 0),
		0
	);

	const tax_total = selectedCartItems.reduce(
		(acc, item) => acc + (item.tax_total || 0),
		0
	);

	const total = subtotal - discount_total + shipping_total + tax_total;

	const selectedCart = {
		...cart,
		shipping_total,
		subtotal,
		tax_total,
		total,
		items: selectedCartItems,
	} as CartWithCheckoutStep;

	useEffect(() => {
		const cart = allCarts.find(
			(cart) =>
				cart?.metadata?.cart_type === 'checkout' && cart?.payment_id === null
		);
		setCheckoutCart(cart);
	}, [allCarts]);

	/**
	 * Function to handle the checkout process for selected items.
	 *
	 * @return {Promise<void>} Promise that resolves once the checkout process is completed
	 */
	const handleSelectedItemCheckout = async () => {
		setIsAdding(true);
		try {
			if (checkoutCart) {
				setIsOpenModal(true);
			} else {
				const newCart = await createCheckoutCart(countryCode);
				if (!newCart) {
					throw new Error('Failed to create checkout cart');
				}
				await Promise.all(
					selectedCartItems.map((item) =>
						addToCheckout({
							cartId: newCart.id,
							variantId: item.variant_id!,
							quantity: item.quantity,
						})
					)
				);
				setCheckoutCart(newCart as Cart);
				setCurrentStep(1);
				router.push(`${ERoutes.CHECKOUT}/?cartId=${newCart.id}`);
			}
		} catch (e) {
			console.error('Error in handleSelectedItemCheckout:', e);
			message.error('An error occurred while processing your checkout');
		} finally {
			setIsAdding(false);
		}
	};

	/**
	 * Handles the "OK" button click event in the modal.
	 *
	 * If there is a checkout cart, it deletes the checkout cart, refreshes the cart,
	 * and sets the checkout cart to undefined.
	 * Then, it creates a new checkout cart using the provided country code.
	 * If the new checkout cart is not created successfully, it throws an error.
	 * Finally, it adds the selected cart items to the new checkout cart,
	 * sets the checkout cart to the new cart, navigates to the checkout page with the new cart ID,
	 * and closes the modal.
	 *
	 * @return {Promise<void>} A promise that resolves when the operation is complete.
	 * @throws {Error} If the new checkout cart cannot be created.
	 */
	const handleModalOk = async () => {
		setIsProcessing(true);
		try {
			if (checkoutCart) {
				await deleteAndRefreshCart(checkoutCart?.id!);
				setCheckoutCart(undefined);
				await refreshCart();
			}
			const newCart = await createCheckoutCart(countryCode);

			if (!newCart) {
				throw new Error('Failed to create checkout cart');
			}
			await Promise.all(
				selectedCartItems.map((item) =>
					addToCheckout({
						cartId: newCart.id,
						variantId: item.variant_id!,
						quantity: item.quantity,
					})
				)
			);
			setCheckoutCart(newCart as Cart);
			setCurrentStep(1);
			router.push(`${ERoutes.CHECKOUT}/?cartId=${newCart.id}`);
		} catch (e) {
			console.error('Error in handleModalOk:', e);
			message.error('An error occurred while processing your request');
		} finally {
			setIsProcessing(false);
			setIsOpenModal(false);
		}
	};

	const handleCancel = () => {
		setIsOpenModal(false);
	};

	const handleCheckCart = () => {
		setCurrentStep(1);
		setIsOpenModal(false);
		router.push(`${ERoutes.CHECKOUT}/?cartId=${checkoutCart?.id}`);
	};

	return (
		<div>
			<div className="flex flex-col gap-y-2 bg-white">
				<Text className="text-[1.5rem] leading-[2.75rem] font-semibold">
					Tóm tắt đơn hàng
				</Text>
				<CartTotals data={selectedCart} />
				<Button
					className="w-full h-10 font-semibold"
					onClick={handleSelectedItemCheckout}
					isLoading={isAdding}
				>
					{`Thanh toán ngay ${
						selectedCartItems?.length > 0
							? '(' + selectedCartItems?.length + ')'
							: ''
					}`}
				</Button>
			</div>
			<Modal
				title="Xác nhận"
				open={isOpenModal}
				onOk={handleModalOk}
				onCancel={handleCancel}
				okText="Tiếp tục thanh toán đơn hàng mới"
				cancelText="Kiểm tra giỏ hàng"
				footer={[
					<Button
						key="check"
						size="middle"
						type="default"
						onClick={handleCheckCart}
						disabled={isProcessing}
					>
						Kiểm tra giỏ hàng
					</Button>,
					<Button
						key="submit"
						size="middle"
						type="primary"
						onClick={handleModalOk}
						loading={isProcessing}
						disabled={isProcessing}
					>
						Tiếp tục thanh toán đơn hàng mới
					</Button>,
				]}
			/>
		</div>
	);
};

export default Summary;
