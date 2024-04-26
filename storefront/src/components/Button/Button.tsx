import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends AntdButtonProps {
	className?: string;
	type?: string;
}

export default function Button({
	className,
	type = 'primary',
	children,
	...props
}: Props) {
	return (
		<AntdButton
			className={cn('leading-none', className)}
			type={type}
			size="large"
			{...props}
		>
			{children}
		</AntdButton>
	);
}
