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
		<Flex vertical gap={4} className="w-full">
			<AntdInput size="large" className={cn('p-3 gap-2', className)} {...props} />
			{error && <ErrorText error={error} />}
		</Flex>
	);
}
