import { Flex as AntdFlex, FlexProps } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props extends FlexProps {
	className?: string;
	children: ReactNode;
}
export default function Flex({ className, children, ...props }: Props) {
	return (
		<AntdFlex className={cn('', className)} {...props}>
			{children}
		</AntdFlex>
	);
}
