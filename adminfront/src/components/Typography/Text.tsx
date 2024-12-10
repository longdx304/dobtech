import { cn } from '@/lib/utils';
import { Typography, TypographyProps } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import { ReactNode } from 'react';
import { Tooltip } from '../Tooltip';

type Props = TextProps & {
	className?: string;
	children?: ReactNode | string | number;
	strong?: boolean;
	tooltip?: boolean;
};

const { Text: AntdText } = Typography;

export default function Text({
	className,
	strong,
	tooltip = false,
	children,
	...props
}: Props) {
	const strongText = strong ? 'font-semibold' : '';
	const tooltipText = typeof children === 'string' ? children : '';
	return (
		<AntdText className={cn('m-0', className, strongText)} {...props}>
			{tooltip ? <Tooltip title={tooltipText}>{children}</Tooltip> : children}
		</AntdText>
	);
}
