import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends AntdInputProps{
	className?: string;
}

export default function Input({ className, ...props }: Props) {
	return <AntdInput size="large" className={cn('', className)} {...props} />;
}
