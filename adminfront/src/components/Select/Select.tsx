import { cn } from '@/lib/utils';
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';

interface Props extends AntdSelectProps {
	className?: string;
	error?: string;
}

export default function Select({ error, className, ...props }: Props) {
	return (
		<AntdSelect
			size="large"
			className={cn('', className)}
			options={props.options}
			{...props}
		/>
	);
}
