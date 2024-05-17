import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';
import { cn } from '@/lib/utils';
import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';

interface Props extends AntdInputProps {
	className?: string;
	error?: string;
}

export default function Input({ error, className, ...props }: Props) {
	return (
		<Flex vertical gap={4} className="">
			<AntdInput className={cn('px-[6px] py-2 gap-2', className)} {...props} allowClear />
			{/* {error && <ErrorText error={error} />} */}
		</Flex>
	);
}
