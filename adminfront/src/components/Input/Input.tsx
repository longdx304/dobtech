import { Input as AntdInput } from 'antd';
import { cn } from '@/lib/utils';

interface Props {
	className?: string;
}

export default function Input({ className, ...props }: Props) {
	return <AntdInput size="large" className={cn('', className)} {...props} />;
}
