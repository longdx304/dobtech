'use client';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useCustomer } from '@/lib/providers/user/user-provider';
import {
	createAndPopulateCheckoutCart,
	findCheckoutCart,
} from '@/lib/utils/handle-checkout-cart';
import CartTotals from '@/modules/common/components/cart-totals';
import LoginTemplate from '@/modules/user/templates/login-template';
import { LOGIN_VIEW } from '@/types/auth';
import { CartWithCheckoutStep } from '@/types/medusa';
import { ERoutes } from '@/types/routes';
import { Cart } from '@medusajs/medusa';
import { message, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SummaryProps = {
	cart: CartWithCheckoutStep;
	selectedItems: string[];
};

const Summary = ({ cart, selectedItems }: SummaryProps) => {
	const {
		allCarts,
		isProcessing,
		setIsProcessing,
		setSelectedCartItems,
		updateExistingCart,
	} = useCart();
	const { customer } = useCustomer();
	const [isAdding, setIsAdding] = useState(false);
	const router = useRouter();
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [checkoutCart, setCheckoutCart] = useState<Cart | undefined>(undefined);
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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
		const cart = findCheckoutCart(allCarts, customer?.email);
		setCheckoutCart(cart);
	}, [allCarts, customer]);

	/**
	 * Function to handle the checkout process for selected items.
	 *
	 * @return {Promise<void>} Promise that resolves once the checkout process is completed
	 */
	const handleSelectedItemCheckout = async () => {
		setIsAdding(true);
		try {
			if (selectedCartItems.length === 0) {
				return message.error('Vui lòng chọn sản phẩm để thanh toán');
			}

			if (!customer) {
				setIsLoginModalOpen(true);
				return;
			}

			if (checkoutCart && checkoutCart.customer_id === customer.id) {
				setIsOpenModal(true);
			} else {
				const newCart = await createAndPopulateCheckoutCart(selectedCartItems);
				router.push(`${ERoutes.CHECKOUT}/?cartId=${newCart.id}`);
			}
		} catch (e) {
			console.error('Error in handleSelectedItemCheckout:', e);
			message.error('Có lỗi xảy ra khi thanh toán!');
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
				await updateExistingCart(checkoutCart.id, selectedCartItems);
			} else {
				const newCart = await createAndPopulateCheckoutCart(selectedCartItems);
				setCheckoutCart(newCart as Cart);
			}
			router.push(`${ERoutes.CHECKOUT}/?cartId=${checkoutCart?.id}`);
		} catch (e) {
			console.error('Error in handleModalOk:', e);
			message.error('Có lỗi xảy ra khi thanh toán!');
		} finally {
			setIsProcessing(false);
			setIsOpenModal(false);
		}
	};

	const handleCancel = () => {
		setIsOpenModal(false);
		setIsProcessing(false);
	};

	const handleCheckCart = () => {
		setIsProcessing(true);
		setIsOpenModal(false);
		router.push(`${ERoutes.CHECKOUT}/?cartId=${checkoutCart?.id}`);
	};

	const handleGuestCheckout = async () => {
		setIsLoginModalOpen(false);
		// Proceed with checkout as a guest
		const newCart = await createAndPopulateCheckoutCart(selectedCartItems);
		router.push(`${ERoutes.CHECKOUT}/?cartId=${newCart.id}`);
	};

	const handleRegister = () => {
		setSelectedCartItems(selectedCart);
		setIsLoginModalOpen(false);
		setIsRegisterModalOpen(true);
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
			{/* Modal for guest checkout or registration */}
			<Modal
				title="Lựa chọn thanh toán"
				open={isLoginModalOpen}
				onCancel={() => setIsLoginModalOpen(false)}
				footer={null}
			>
				<Flex className="flex-col gap-y-4">
					<Text className="text-sm font-normal">
						Bạn có thể thanh toán ngay hoặc đăng ký tài khoản để tiếp tục.
					</Text>
					<Flex
						gap={6}
						justify="space-between"
						className="w-full flex-col lg:flex-row"
					>
						<Button onClick={handleGuestCheckout} type="default">
							Thanh toán ngay
						</Button>
						<Button onClick={handleRegister}>
							Đăng ký tài khoản và thanh toán
						</Button>
					</Flex>
				</Flex>
			</Modal>

			{/* Modal for registration */}
			<Modal
				open={isRegisterModalOpen}
				onCancel={() => setIsRegisterModalOpen(false)}
				footer={null}
			>
				<LoginTemplate initialView={LOGIN_VIEW.REGISTER} />
			</Modal>

			{/* Modal if there is a checkout cart to be processed */}
			<Modal
				title="Xác nhận đơn hàng"
				open={isOpenModal}
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
						loading={isProcessing}
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
			>
				<Text className="text-sm font-normal">
					Đã tồn tại 1 đơn hàng. Bạn chắc chắn thanh toán đơn hàng này chứ?
				</Text>
			</Modal>
		</div>
	);
};

export default Summary;
