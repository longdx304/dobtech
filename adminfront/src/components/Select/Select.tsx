import { cn } from '@/lib/utils';
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';

interface Props extends AntdSelectProps {
	className?: string;
}

export default function Select({ className, ...props }: Props) {
	return (
		<AntdSelect
			size="small"
			className={cn(
				'[&_.ant-select-selector]:p-[4px] [&_.ant-select-selection-placeholder]:pl-[4px] [&_.ant-select-selection-item]:pl-[4px]',
				className
			)}
			options={props.options}
			{...props}
		/>
	);
}
