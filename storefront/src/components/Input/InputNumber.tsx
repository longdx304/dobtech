import type { InputNumberProps } from 'antd';
import AntdInputNumber from 'antd/es/input-number';

import { cn } from '@/lib/utils';

interface Props extends InputNumberProps {
	className?: string;
}

export default function InputNumber({ className, ...props }: Props) {
	const formatter = (value: any) => {
    if (value) {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return value;
  };

  const parser = (value: any) => {
    return value.replace(/\$\s?|(,*)/g, '');
  };

	return (
		<AntdInputNumber
			size="large"
			className={cn('p-[3px] gap-2 w-full', className)}
			formatter={formatter}
			parser={parser}
			{...props}
		/>
	);
}
