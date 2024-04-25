import { Typography, TypographyProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends TypographyProps {
	className?: string;
	children: React.ReactNode;
}

const { Paragraph: AntParagraph } = Typography;

export default function Paragraph({ className, children, ...props }: Props) {
	return (
		<AntParagraph className={cn('m-0', className)} {...props}>
			{children}
		</AntParagraph>
	);
}
