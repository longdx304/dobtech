import { Checkbox as AntdCheckbox, CheckboxProps } from 'antd';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';

interface Props extends CheckboxProps {
	className?: string;
	children?: ReactNode;
	error?: string;
}

export default function CheckboxGroup({
	error,
	className,
	children,
	...props
}: Props) {
	return (
		<Flex vertical gap={4}>
			<AntdCheckbox.Group className={cn('', className)} {...props}>
				{children}
			</AntdCheckbox.Group>
			{error && <ErrorText error={error} />}
		</Flex>
	);
}
