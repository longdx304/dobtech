import { cn } from '@/lib/utils';
import { Tooltip as AntdTooltip, TooltipProps } from 'antd';
import { Text } from '@/components/Typography';
import { Flex } from '@/components/Flex';

type Props = TooltipProps & {
	className?: string;
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
};

export default function TooltipIcon({
	title,
	className,
	icon,
	label,
	children,
	...props
}: Props) {
	return (
		<Flex gap="4px" align="center" className={cn('', className)}>
			{children}
			<AntdTooltip
				className="cursor-pointer [&_.ant-tooltip-inner]:!text-gray-500"
				color="white"
				title={title}
				{...props}
			>
				{icon}
			</AntdTooltip>
		</Flex>
	);
}
