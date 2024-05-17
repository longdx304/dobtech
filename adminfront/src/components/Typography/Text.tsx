import { cn } from '@/lib/utils';
import { Typography, TypographyProps } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import { ReactNode } from 'react';

type Props = TextProps & {
	className?: string;
	children?: ReactNode;
	strong?: boolean;
}

const { Text: AntdText } = Typography;

export default function Text({ className, strong, children, ...props }: Props) {
	return (
		<AntdText className={cn('m-0 text-sm', className)} {...props}>
			{strong ? <strong>{children}</strong> : children}
		</AntdText>
	);
}
