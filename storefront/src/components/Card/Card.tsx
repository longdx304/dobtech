import { Card as AntdCard, CardProps } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props extends CardProps {
	className?: string;
	children?: ReactNode;
	bordered?: boolean;
}
export default function Card({
	className,
	bordered = false,
	children,
	...props
}: Props) {
	return (
		<AntdCard
			className={cn(
				'shadow-lg p-4',
				bordered ? 'rounded-xl' : 'max-sm:rounded-none',
				className,
			)}
			{...props}
		>
			{children}
		</AntdCard>
	);
}
