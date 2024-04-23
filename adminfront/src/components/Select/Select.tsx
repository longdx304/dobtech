import { Flex } from '@/components/Flex';
import { cn } from '@/lib/utils';
import { SelectProps as AntdSelectProps, Select as AntdSelect } from 'antd';

interface Props extends AntdSelectProps {
	className?: string;
	error?: string;
}

export default function Select({ error, className, ...props }: Props) {
	return (
		<Flex vertical gap={4} className="w-full">
			<AntdSelect
				size="large"
				className={cn('', className)}
				{...props}
			/>
		</Flex>
	);
}
