import { Card as AntdCard } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props {
	className?: string;
	children?: ReactNode;
}
export default function Card({ className, children }: Props) {
	return (
		<AntdCard className={cn('p-4 shadow-lg', className)}>
			{children}
		</AntdCard>
	);
}
