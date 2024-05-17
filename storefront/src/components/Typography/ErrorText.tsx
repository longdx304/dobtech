import Text from './Text';

interface Props {
	error?: string | null;
	'data-testid'?: string;
}
const ErrorText = ({ error, 'data-testid': dataTestid }: Props) => {
	if (!error) {
		return null;
	}

	return (
		<Text
			className="text-sm"
			data-testid={dataTestid}
			type="danger"
		>
			<span>{error}</span>
		</Text>
	);
};

export default ErrorText;
