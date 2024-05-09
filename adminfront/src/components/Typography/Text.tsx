import { cn } from '@/lib/utils';
import { Typography } from 'antd';
import { ReactNode } from 'react';

interface Props {
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
