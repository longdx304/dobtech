import { Typography, ParagraphProps } from 'antd';

interface Props extends ParagraphProps {};

const { Paragraph: AntParagraph } = Typography;

export default function Paragraph({children,...props} : Props) {
	return (
		<AntParagraph {...props}>{children}</AntParagraph>
	)
}