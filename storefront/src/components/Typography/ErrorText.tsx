import React from 'react';
import Text from 'antd/es/typography/Text';

interface ErrorTextProps {
	error?: string | null;
	'data-testid'?: string;
}

export default function ErrorText({
	error,
	'data-testid': dataTestid,
}: ErrorTextProps) {
	if (!error) {
		return null;
	}

	return (
		<Text className="text-sm" data-testid={dataTestid} type="danger">
			<span>{error}</span>
		</Text>
	);
}
