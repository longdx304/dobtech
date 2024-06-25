'use client';

import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { formatAmount } from '@/lib/utils/prices';
import { Cart, Order } from '@medusajs/medusa';
import React from 'react';

type CartTotalsProps = {
	data: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
};

const CartTotals: React.FC<CartTotalsProps> = ({ data }) => {
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
		<Flex align="center" justify="end" className="flex justify-items-end">
			<Text
				className="text-[1rem] leading-[2.75rem] font-semibold"
				data-testid="cart-total"
				data-value={total || 0}
			>
				{getAmount(total)}
			</Text>
		</Flex>
	);
};

export default CartTotals;
