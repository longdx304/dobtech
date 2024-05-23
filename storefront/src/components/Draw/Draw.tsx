import { FC, ReactNode } from 'react';
import { Draw as AntdDraw, DrawProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends DrawProps {
	className?: string;
	children?: ReactNode;
}
const Draw: FC<Props> = ({ className, children, ...props }) => {
	return (
		<AntdDraw className={cn('', className)} {...props}>
			{children}
		</AntdDraw>
	);
};

export default Draw;
