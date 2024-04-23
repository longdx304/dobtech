import { Tooltip as AntdTooltip, TooltipProps } from 'antd';
import { cn } from '@/lib/utils';
import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';

interface Props extends TooltipProps {
	className?: string;
	title: string;
	icon: React.ReactNode;
}

export default function TooltipIcon({
	title,
	className,
	icon,
	...props
}: Props) {
	return (
		<AntdTooltip
			className={cn('', className)}
			color="white"
			title={title}
			{...props}
		>
			{icon}
		</AntdTooltip>
	);
}
