import { Flex } from '@/components/Flex';
import { cn } from '@/lib/utils';
import {
	Select as AntdSelect,
	SelectProps as AntdSelectProps
} from 'antd';

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
				options={props.options}
			/>
		</Flex>
	);
}
