import { Tooltip as AntdTooltip, TooltipProps } from 'antd';
import { cn } from '@/lib/utils';
import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';

interface Props extends TooltipProps {
	className?: string;
	title: string;
	children?: ReactNode;
}

export default function Tooltip({
	title,
	className,
	children,
	...props
}: Props) {
	return (
		<AntdTooltip
			className={cn('!text-sm text-black', className)}
			color="white"
			title={title}
			{...props}
		>
			{children}
		</AntdTooltip>
	);
}
