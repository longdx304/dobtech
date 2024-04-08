import { Card as AntdCard } from 'antd';
import { cn } from '@/lib/utils';

interface Props {
	className?: string;
}
export default function Card({ className, children }: Props) {
	return (
		<AntdCard className={cn('p-8 shadow-lg', className)}>
			{children}
		</AntdCard>
	);
}
