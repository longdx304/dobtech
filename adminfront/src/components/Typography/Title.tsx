import { Typography, TitleProps } from 'antd';

interface Props extends TitleProps {};

const { Title: AntdTitle } = Typography;

export default function Title({children,...props} : Props) {
	return (
		<AntdTitle {...props}>{children}</AntdTitle>
	)
}