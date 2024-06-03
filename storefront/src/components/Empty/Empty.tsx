import { cn } from '@/lib/utils';
import { Empty as AntdEmpty, EmptyProps } from 'antd';

interface Props extends EmptyProps {
	className?: string;
}

export default function Empty({ className, ...props }: Props) {
	return <AntdEmpty className={cn('', className)} {...props} />;
}
