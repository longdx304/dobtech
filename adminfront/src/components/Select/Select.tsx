import { cn } from '@/lib/utils';
import { Select as AntdSelect, SelectProps } from 'antd';

interface Props extends SelectProps {
	className?: string;
}

export default function Select({ className, ...props }: Props) {
	return <AntdSelect className={cn('', className)} {...props} />;
}
