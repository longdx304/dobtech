'use client';

import { Button } from '@/components/Button';
import { Text } from '@/components/Typography';
import { useCart } from '@/lib/providers/cart/cart-provider';
import CartTotals from '@/modules/common/components/cart-totals';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { CartWithCheckoutStep } from '@/types/medusa';
import { message } from 'antd';

type SummaryProps = {
	cart: CartWithCheckoutStep;
	selectedItems: string[];
};

const Summary = ({ cart, selectedItems }: SummaryProps) => {
	const { setSelectedCartItems, setCurrentStep } = useCart();

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

	return (
		<div className="flex flex-col gap-y-2 bg-white">
			<Text className="text-[1.5rem] leading-[2.75rem] font-semibold">
				Tóm tắt đơn hàng
			</Text>
			<CartTotals data={selectedCart} />
			<Button
				className="w-full h-10 font-semibold"
				onClick={handleCheckout}
			>{`Thanh toán ngay ${
				selectedCartItems?.length > 0
					? '(' + selectedCartItems?.length + ')'
					: ''
			}`}</Button>
		</div>
	);
};

export default Summary;
