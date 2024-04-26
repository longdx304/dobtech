import { Typography, ParagraphProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends ParagraphProps {
	className?: string;
}

const { Paragraph: AntParagraph } = Typography;

export default function Paragraph({ className, children, ...props }: Props) {
	return (
		<AntParagraph className={cn('m-0', className)} {...props}>
			{children}
		</AntParagraph>
	);
}
