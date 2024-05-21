import { cn } from '@/lib/utils';
import { Breadcrumb as AntdBreadcrumb, BreadcrumbProps } from 'antd';

interface Props extends BreadcrumbProps {
	className?: string;
}

export default function Breadcrumb({ className, ...props }: Props) {
	return <AntdBreadcrumb className={cn('', className)} {...props} />;
}
