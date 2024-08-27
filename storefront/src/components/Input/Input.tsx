import { cn } from '@/lib/utils';
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';

interface Props extends AntdInputProps {
	className?: string;
}

export default function Input({ className, ...props }: Props) {
	return <AntdInput className={cn('p-3 gap-2', className)} {...props} />;
}
