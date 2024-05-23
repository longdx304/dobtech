import { cn } from '@/lib/utils';
import { Drawer as AntdDraw, DrawerProps } from 'antd';
import { FC, ReactNode } from 'react';

interface Props extends DrawerProps {
	className?: string;
	children?: ReactNode;
}
const Drawer: FC<Props> = ({ className, children, ...props }) => {
	return (
		<AntdDraw className={cn('', className)} {...props}>
			{children}
		</AntdDraw>
	);
};

export default Drawer;
