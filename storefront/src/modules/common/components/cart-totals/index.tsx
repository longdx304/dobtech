'use client';

import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { formatAmount } from '@/lib/utils/prices';
import { Cart, Order } from '@medusajs/medusa';
import { Divider } from 'antd';
import React from 'react';

type CartTotalsProps = {
	data: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
	type?: CartType;
};

// create for me enum type
export enum CartType {
	CART = 'cart',
	CHECKOUT = 'checkout',
	ORDER = 'order',
}

const CartTotals: React.FC<CartTotalsProps> = ({
	data,
	type = CartType.CART,
}) => {
	const {
		subtotal,
		discount_total,
		gift_card_total,
		tax_total,
		shipping_total,
		total,
	} = data;

	const getAmount = (amount: number | null | undefined) => {
		return formatAmount({
			amount: amount || 0,
			region: data.region,
			includeTaxes: false,
		});
	};

	return (
		<>
			{type === 'cart' && (
				<Flex align="center" justify="end" className="flex justify-items-end">
					<>
						<Text
							className="text-[1.35rem] leading-[1.25rem] font-bold"
							data-testid="cart-total"
							data-value={total || 0}
						>
							{getAmount(total)}
						</Text>
					</>
				</Flex>
			)}

			<Flex className="flex-col gap-y-2 text-gray-500">
				{type === 'checkout' && (
					<>
						{/* Subtotal */}
						<div className="flex items-center justify-between">
							<Text>Thành giá</Text>
							<Text data-testid="order-subtotal" data-value={subtotal || 0}>
								{getAmount(subtotal)}
							</Text>
						</div>

						{/* Discount */}
						{!!discount_total && (
							<div className="flex items-center justify-between">
								<Text>Phiếu giảm giá</Text>
								<Text
									className="text-red-500"
									data-testid="order-discount"
									data-value={discount_total || 0}
								>
									- {getAmount(discount_total)}
								</Text>
							</div>
						)}

						{/* Shipping */}
						<div className="flex items-center justify-between">
							<Text>Giá ship</Text>
							<Text
								data-testid="order-shipping"
								data-value={shipping_total || 0}
							>
								{getAmount(shipping_total)}
							</Text>
						</div>

						{/* Tax */}
						<div className="flex items-center justify-between">
							<Text>Thuế</Text>
							<Text data-testid="order-tax" data-value={tax_total || 0}>
								{getAmount(tax_total)}
							</Text>
						</div>

						{/* Gift Card */}
						{!!gift_card_total && (
							<div className="flex items-center justify-between">
								<Text>Thẻ quà tặng</Text>
								<Text
									className="text-green-500"
									data-testid="order-gift-card"
									data-value={gift_card_total || 0}
								>
									- {getAmount(gift_card_total)}
								</Text>
							</div>
						)}

						{/* Divider */}
						<Divider className="my-2 mx-0" />

						{/* Total */}
						<div className="flex items-center justify-between text-black mb-2">
							<Text className="font-semibold">Tổng tiền</Text>
							<Text
								className="text-lg font-bold"
								data-testid="order-total"
								data-value={total || 0}
							>
								{getAmount(total)}
							</Text>
						</div>

						{/* Divider */}
						<Divider className="my-2 mx-0" />
					</>
				)}
			</Flex>

			<Flex className="flex-col gap-y-2 text-gray-500">
				{type === 'order' && (
					<>
						{/* Subtotal */}
						<div className="flex items-center justify-between">
							<Text>Thành giá</Text>
							<Text data-testid="order-subtotal" data-value={subtotal || 0}>
								{getAmount(subtotal)}
							</Text>
						</div>

						{/* Discount */}
						{!!discount_total && (
							<div className="flex items-center justify-between">
								<Text>Phiếu giảm giá</Text>
								<Text
									className="text-red-500"
									data-testid="order-discount"
									data-value={discount_total || 0}
								>
									- {getAmount(discount_total)}
								</Text>
							</div>
						)}

						{/* Shipping */}
						<div className="flex items-center justify-between">
							<Text>Giá ship</Text>
							<Text
								data-testid="order-shipping"
								data-value={shipping_total || 0}
							>
								{getAmount(shipping_total)}
							</Text>
						</div>

						{/* Tax */}
						<div className="flex items-center justify-between">
							<Text>Thuế</Text>
							<Text data-testid="order-tax" data-value={tax_total || 0}>
								{getAmount(tax_total)}
							</Text>
						</div>

						{/* Gift Card */}
						{!!gift_card_total && (
							<div className="flex items-center justify-between">
								<Text>Thẻ quà tặng</Text>
								<Text
									className="text-green-500"
									data-testid="order-gift-card"
									data-value={gift_card_total || 0}
								>
									- {getAmount(gift_card_total)}
								</Text>
							</div>
						)}

						{/* Divider */}
						<Divider className="my-2 mx-0" />

						{/* Total */}
						<div className="flex items-center justify-between text-black mb-2">
							<Text className="font-semibold">Tổng tiền</Text>
							<Text
								className="text-lg font-bold"
								data-testid="order-total"
								data-value={total || 0}
							>
								{getAmount(total)}
							</Text>
						</div>

						{/* Divider */}
						<Divider className="my-2 mx-0" />
					</>
				)}
			</Flex>
		</>
	);
};

export default CartTotals;
