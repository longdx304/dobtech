import { FC, ReactNode } from 'react';
import { Drawer as AntdDrawer, DrawerProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends DrawerProps {
	className?: string;
	children?: ReactNode;
}
const Drawer: FC<Props> = ({ className, children, ...props }) => {
	return (
		<AntdDrawer className={cn('', className)} {...props}>
			{children}
		</AntdDrawer>
	);
};

export default Drawer;
