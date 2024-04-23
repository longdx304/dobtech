import type { InputNumberProps } from 'antd';
import { InputNumber as AntdInputNumber, Flex } from 'antd';

import { cn } from '@/lib/utils';

interface Props extends InputNumberProps {
	className?: string;
}

export default function InputNumber({ className, ...props }: Props) {
	return (
		<Flex vertical gap={4} className="w-full">
			<AntdInputNumber
				size="large"
				className={cn('p-3 gap-2 w-full', className)}
				{...props}
			/>
		</Flex>
	);
}
