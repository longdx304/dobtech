import { cn } from '@/lib/utils';
import { Radio as AntdRadio, RadioProps } from 'antd';

interface Props extends RadioProps {
	className?: string;
	children?: React.ReactNode;
}

export default function Radio({ className, children, ...props }: Props) {
	return (
		<AntdRadio className={cn('w-full', className)} {...props}>
			{children}
		</AntdRadio>
	);
}
