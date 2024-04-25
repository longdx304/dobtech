import { cn } from '@/lib/utils';
import { Typography } from 'antd';
import { ReactNode } from 'react';

interface Props {
	className?: string;
	children?: ReactNode;
	strong?: boolean;
	typeStyle?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

import { BaseType } from 'antd/lib/typography/Base';

const { Text: AntdText } = Typography;

export default function Text({
	className,
	strong,
	typeStyle,
	children,
	...props
}: Props) {
	return (
		<AntdText
			className={cn('m-0 text-base', className)}
			{...props}
			type={typeStyle as BaseType}
		>
			{strong ? <strong>{children}</strong> : children}
		</AntdText>
	);
}
