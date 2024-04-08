import { Button as AntdButton } from 'antd';
import { cn } from '@/lib/utils';

interface Props {
	className?: string;
	type?: 'primary' | 'dashed' | 'text' | 'link';
}

export default function Button({
	className,
	type = 'primary',
	children,
	...props
}: Props) {
	return (
		<AntdButton className={cn('', className)} type={type} size="large" {...props}>
			{children}
		</AntdButton>
	);
}
