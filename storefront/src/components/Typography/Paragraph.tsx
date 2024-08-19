import { cn } from '@/lib/utils';
import AntParagraph, { ParagraphProps } from 'antd/es/typography/Paragraph';

interface Props extends ParagraphProps {
	className?: string;
	children?: React.ReactNode;
}

export default function Paragraph({ className, children, ...props }: Props) {
	return (
		<AntParagraph className={cn('m-0', className)} {...props}>
			{children}
		</AntParagraph>
	);
}
