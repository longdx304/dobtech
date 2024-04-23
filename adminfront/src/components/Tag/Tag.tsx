import { Tag as AntdTag, TagProps } from 'antd';
import { cn } from '@/lib/utils';
import { Flex } from '@/components/Flex';
import { ErrorText } from '@/components/Typography';

interface Props extends TagProps {
	className?: string;
}

export default function Tag({ className, ...props }: Props) {
	return (
		<AntdTag className={cn('', className)} {...props} />
	);
}
