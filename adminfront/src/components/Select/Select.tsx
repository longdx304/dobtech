import { Select as AntdSelect, SelectProps } from 'antd';
import { cn } from '@/lib/utils';
import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';

interface Props extends SelectProps {
	className?: string;
}

export default function Select({ className, ...props }: Props) {
	return <AntdSelect className={cn('', className)} {...props} />;
}
