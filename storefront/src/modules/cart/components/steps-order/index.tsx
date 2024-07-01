'use client';
import { ShoppingBasket, WalletCards, CircleCheck } from 'lucide-react';

import { Steps } from '@/components/Steps';
import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { Flex } from '@/components/Flex';
import { useState } from 'react';

type Props = {
	currentStep?: number;
	className?: string;
};

const StepsOrder = ({ className, currentStep = 0 }: Props) => {
	const { currentStep: step, setCurrentStep } = useCart();

	const ITEMS_STEP = [
		{
			title: (
				<Flex
					gap={4}
					onClick={() => setCurrentStep(0)}
					className="cursor-pointer"
				>
					<ShoppingBasket size={28} />
					<span>Đơn hàng của bạn</span>
				</Flex>
			),
			icon: null,
		},
		{
			title: (
				<Flex
					gap={4}
					onClick={() => setCurrentStep(1)}
					className="cursor-pointer"
				>
					<WalletCards size={28} />
					<span>Thanh toán</span>
				</Flex>
			),
			icon: null,
		},
		{
			title: (
				<Flex
					gap={4}
					className="cursor-pointer"
				>
					<CircleCheck size={28} />
					<span>Hoàn tất</span>
				</Flex>
			),
			icon: null,
		},
	];

	return (
		<Card className={cn('', className)}>
			<Steps
				current={currentStep}
				items={ITEMS_STEP}
				className="[&_.ant-steps-item-icon]:hidden"
			/>
		</Card>
	);
};

export default StepsOrder;
