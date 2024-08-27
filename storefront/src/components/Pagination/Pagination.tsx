import { cn } from '@/lib/utils';
import { Pagination as AntdPagination, PaginationProps } from 'antd';

interface Props extends PaginationProps {
	className?: string;
}

export default function Pagination({ className, ...props }: Props) {
	return <AntdPagination className={cn('', className)} {...props} />;
}
