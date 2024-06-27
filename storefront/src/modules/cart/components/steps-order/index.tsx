import { ShoppingBasket, WalletCards, CircleCheck } from 'lucide-react';

import { Steps } from '@/components/Steps';
import { Card } from '@/components/Card';
import { cn } from '@/lib/utils'

type Props = {
	currentStep?: number;
	className?: string;
};

const StepsOrder = ({ className, currentStep = 0 }: Props) => {
	const ITEMS_STEP = [
		{
			title: 'Giỏ hàng',
			icon: <ShoppingBasket size={28} />,
		},
		{
			title: 'Đặt hàng',
			icon: <WalletCards />,
		},
		{
			title: 'Thanh toán',
			icon: <WalletCards size={28} />,
		},
		{
			title: 'Hoàn thành',
			icon: <CircleCheck size={28} />,
		},
	];

	return (
		<Card className={cn('',className)}>
			<Steps current={currentStep} items={ITEMS_STEP} className="" />
		</Card>
	);
};

export default StepsOrder;
