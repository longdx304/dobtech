'use client';
import { CircleCheck, ShoppingBasket, WalletCards } from 'lucide-react';

import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Steps } from '@/components/Steps';
import { cn } from '@/lib/utils';
import { ERoutes } from '@/types/routes';
import { useRouter } from 'next/navigation';

type Props = {
	currentStep?: number;
	className?: string;
};

const StepsOrder = ({ className, currentStep = 0 }: Props) => {
	const router = useRouter();

	const ITEMS_STEP = [
		{
			title: (
				<Flex
					gap={4}
					onClick={() => {
						router.push(`/${ERoutes.CART}`);
					}}
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
				<Flex gap={4} className="cursor-pointer">
					<WalletCards size={28} />
					<span>Thanh toán</span>
				</Flex>
			),
			icon: null,
		},
		{
			title: (
				<Flex gap={4} className="cursor-pointer">
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
				className="[&_.ant-steps-item-icon]:hidden [&_.ant-steps-item-tail]:p-[30px_0_0]"
			/>
		</Card>
	);
};

export default StepsOrder;
