import { Typography, TextProps } from 'antd';

interface Props extends TextProps {};

const { Text: AntdText } = Typography;

export default function Text({children,...props} : Props) {
	return (
		<AntdText {...props}>{children}</AntdText>
	)
}