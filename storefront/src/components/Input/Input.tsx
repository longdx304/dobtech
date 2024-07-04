import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';
import { cn } from '@/lib/utils';
import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';

interface Props extends AntdInputProps {
	className?: string;
	// error?: string;
}

export default function Input({ className, ...props }: Props) {
	return <AntdInput className={cn('p-3 gap-2', className)} {...props} />;
}
