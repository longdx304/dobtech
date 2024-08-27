import React from 'react';
import Button from './Button';
import { cn } from '@/lib/utils';
import { Badge, BadgeProps } from 'antd';
interface Props extends BadgeProps {
	className?: string;
	icon?: React.ReactNode;
	onClick?: () => void;
}

export default function BadgeButton({
	className,
	icon,
	children,
	onClick,
	...props
}: Props) {
	return (
		<Badge {...props}>
			<Button
				className={cn('leading-none', className)}
				icon={icon}
				shape="circle"
				type="text"
				onClick={onClick}
			>
				{children}
			</Button>
		</Badge>
	);
}
