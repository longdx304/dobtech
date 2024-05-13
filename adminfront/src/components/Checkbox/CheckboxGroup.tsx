import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';
import { cn } from '@/lib/utils';
import { Checkbox as AntdCheckbox, CheckboxProps } from 'antd';
import { ReactNode } from 'react';

interface Props extends CheckboxProps {
	className?: string;
	children?: ReactNode;
	error?: string;
	options?: any;
}

export default function CheckboxGroup({
	error,
	className,
	children,
	options,
	...props
}: Props) {
	return (
		<AntdCheckbox.Group
			className={cn('', className)}
			{...props}
			options={options}
		>
			{children}
		</AntdCheckbox.Group>
	);
}
