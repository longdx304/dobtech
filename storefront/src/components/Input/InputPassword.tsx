import { InputProps as AntdInputProps } from 'antd';
import AntInputPassword from 'antd/es/input/Password';

import { cn } from '@/lib/utils';

interface Props extends AntdInputProps {
	className?: string;
}

export default function InputPassword({ className, ...props }: Props) {
	return (
		<AntInputPassword size="large" className={cn('p-3 gap-2', className)} {...props} />
	);
}
