import { Flex } from '@/components/Flex';
import { cn } from '@/lib/utils';
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';

interface Props extends AntdInputProps {
	className?: string;
	error?: string;
}

export default function Input({ error, className, ...props }: Props) {
	return (
		<Flex vertical gap={4} className="">
			<AntdInput
				className={cn('px-[6px] py-2 gap-2', className)}
				{...props}
				allowClear
			/>
		</Flex>
	);
}
