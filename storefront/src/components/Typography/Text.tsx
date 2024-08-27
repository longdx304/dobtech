'use client';
import { cn } from '@/lib/utils';
import AntdText from 'antd/es/typography/Text';
import { ReactNode } from 'react';

interface Props {
	className?: string;
	children?: ReactNode;
	strong?: boolean;
	typeStyle?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
	onMouseEnter?: () => void;
	onClick?: () => void;
	style?: React.CSSProperties;
}

import { BaseType } from 'antd/es/typography/Base';

export default function Text({
	className,
	strong,
	typeStyle,
	children,
	onMouseEnter,
	onClick,
	style,
	...props
}: Props) {
	return (
		<AntdText
			className={cn('m-0', className)}
			{...props}
			type={typeStyle as BaseType}
			onMouseEnter={onMouseEnter}
			onClick={onClick}
			style={style}
		>
			{strong ? <strong>{children}</strong> : children}
		</AntdText>
	);
}
