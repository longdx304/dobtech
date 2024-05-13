import { FC } from 'react';

import { Tabs as AntdTabs, type TabsProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends TabsProps {
	className?: string;
}

const Tabs = ({ className, ...props }: Props) => {
	return <AntdTabs className={cn('', className)} {...props} />;
};

export default Tabs;
