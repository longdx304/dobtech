import { Typography, TitleProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends TitleProps {
	className?: string;
};

const { Title: AntdTitle } = Typography;

export default function Title({className, children,...props} : Props) {
	return (
		<AntdTitle {...props} className={cn("m-0", className)}>{children}</AntdTitle>
	)
}