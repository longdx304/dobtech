import { Checkbox as AntdCheckbox, CheckboxProps } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props extends CheckboxProps {
	className?: string;
	children?: ReactNode;
}

export default function Checkbox({ className, children, ...props }: Props) {
	return (
		<AntdCheckbox className={cn('', className)} {...props}>
			{children}
		</AntdCheckbox>
	);
}
