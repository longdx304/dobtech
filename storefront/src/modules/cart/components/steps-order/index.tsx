'use client';
import { CircleCheck, ShoppingBasket, WalletCards } from 'lucide-react';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Steps } from '@/components/Steps';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { cn } from '@/lib/utils';

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
					<span>Đơn hàng</span>
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
