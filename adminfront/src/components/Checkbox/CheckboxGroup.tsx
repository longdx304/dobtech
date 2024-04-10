import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';
import { cn } from '@/lib/utils';
import { Checkbox as AntdCheckbox, CheckboxProps } from 'antd';
import { ReactNode } from 'react';

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
			<AntdCheckbox.Group
				className={cn('', className)}
				{...props}
				onChange={() => {}}
			>
				{children}
			</AntdCheckbox.Group>
			{error && <ErrorText error={error} />}
		</Flex>
	);
}
