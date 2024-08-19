'use client';
import { cn } from '@/lib/utils';
import AntdTitle from 'antd/es/typography/Title';
import { ReactNode } from 'react';

interface Props {
	className?: string;
	children?: ReactNode;
	level?: 1 | 2 | 3 | 4 | 5;
}

export default function Title({
	className,
	children,
	level = 1,
	...props
}: Props) {
	return (
		<AntdTitle {...props} className={cn('m-0', className)} level={level}>
			{children}
		</AntdTitle>
	);
}
