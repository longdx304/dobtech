import { Card as AntdCard, CardProps } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props extends CardProps {
	className?: string;
	children?: ReactNode;
}
export default function Card({ className, children, ...props }: Props) {
	return (
		<AntdCard className={cn('p-4 shadow-lg', className)} {...props}>
			{children}
		</AntdCard>
	);
}
