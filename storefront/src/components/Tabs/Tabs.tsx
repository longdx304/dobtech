import { cn } from '@/lib/utils';
import { Tabs as AntdTabs } from 'antd';
import type { TabsProps } from 'antd';

interface Props extends TabsProps {
	className?: string;
}

const Tabs = ({ className, ...props }: Props) => {
	return <AntdTabs className={cn('', className)} {...props} />;
};

export default Tabs;
