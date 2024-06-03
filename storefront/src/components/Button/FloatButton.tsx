import { FloatButton as AntdFloatButton, FloatButtonProps } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props extends FloatButtonProps {
	className?: string;
}

export default function FloatButton({
	className,
	...props
}: Props) {
	return (
		<AntdFloatButton
			className={cn('', className)}
			shape="circle"
			{...props}
		/>
	);
}
