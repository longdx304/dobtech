'use client';

import { Button } from '@/components/Button';
import { Text } from '@/components/Typography';
import { useCart } from '@/lib/providers/cart/cart-provider';
import CartTotals from '@/modules/common/components/cart-totals';
import { CartWithCheckoutStep } from '@/types/medusa';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { addToCart, getOrSetCart } from '../action';
import { useCreateCart } from 'medusa-react';
import _ from 'lodash';
import { useState } from 'react';

type SummaryProps = {
	cart: CartWithCheckoutStep;
	selectedItems: string[];
};

const countryCode = 'vn';

const Summary = ({ cart, selectedItems }: SummaryProps) => {
	const { setSelectedCartItems, setCurrentStep, refreshCart } = useCart();
	const router = useRouter();
	const [isAdding, setIsAdding] = useState(false);

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
		subtotal,
		discount_total,
		shipping_total,
		tax_total,
		total,
		items: selectedCartItems,
	} as CartWithCheckoutStep;

	const handleCheckout = () => {
		if (selectedCartItems?.length === 0) {
			message.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
			return;
		}
		setSelectedCartItems(selectedCart);
		setCurrentStep(1);
	};

	// // add the selected variant to the cart
	const handleSelectedItemCheckout = async () => {
		setIsAdding(true);

		if (!selectedCartItems || selectedCartItems.length === 0) {
			message.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
			setIsAdding(false);
			return;
		}

		for (const item of selectedCartItems) {
			const { variant_id, quantity } = item;
			console.log('variant_id', variant_id, quantity);

			// Ensure variant_id and quantity are valid before calling addToCart
			if (variant_id && quantity) {
				await addToCart({
					variantId: variant_id,
					quantity: quantity,
					countryCode,
				});
			} else {
				message.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
			}
		}

		refreshCart();

		setIsAdding(false);
	};

	return (
		<div className="flex flex-col gap-y-2 bg-white">
			<Text className="text-[1.5rem] leading-[2.75rem] font-semibold">
				Tóm tắt đơn hàng
			</Text>
			<CartTotals data={selectedCart} />
			<Button
				className="w-full h-10 font-semibold"
				onClick={handleSelectedItemCheckout}
			>{`Thanh toán ngay ${
				selectedCartItems?.length > 0
					? '(' + selectedCartItems?.length + ')'
					: ''
			}`}</Button>
		</div>
	);
};

export default Summary;
