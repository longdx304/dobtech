import { Typography, TextProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends TextProps {
	className?: string;
};

const { Text: AntdText } = Typography;

export default function Text({className, children,...props} : Props) {
	return (
		<AntdText className={cn("m-0 text-base", className)} {...props}>{children}</AntdText>
	)
}