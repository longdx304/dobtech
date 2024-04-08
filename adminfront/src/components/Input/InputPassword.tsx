import { Input as AntdInput } from 'antd';
import { cn } from '@/lib/utils';

interface Props {
	className?: string;
}

export default function InputPassword({ className, ...props }: Props) {
	return (
		<AntdInput.Password size="large" className={cn('', className)} {...props} />
	);
}
