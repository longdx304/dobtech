'use client';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import { useEffect } from 'react';

type RouteErrorStateProps = {
	error: Error & { digest?: string };
	reset: () => void;
	title: string;
	description: string;
	logContext: string;
};

const RouteErrorState = ({
	error,
	reset,
	title,
	description,
	logContext,
}: RouteErrorStateProps) => {
	useEffect(() => {
		console.error(`${logContext}:`, error);
	}, [error, logContext]);

	return (
		<Flex
			vertical
			align="center"
			justify="center"
			gap={12}
			className="min-h-[320px] rounded-lg bg-white p-6 text-center"
		>
			<Title level={4}>{title}</Title>
			<Text className="max-w-lg text-gray-500">{description}</Text>
			<Button type="primary" onClick={reset}>
				Thử lại
			</Button>
		</Flex>
	);
};

export default RouteErrorState;
