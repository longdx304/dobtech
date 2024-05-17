'use client';
import React, { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

interface Props {
	className?: string;
	'data-testid'?: string;
	children: ReactNode;
	icons?: ReactNode;
	form?: any;
}

const SubmitButton = ({
	className,
	'data-testid': dataTestId,
	children,
	icons,
	form,
	...props
}: Props) => {
	const { pending } = useFormStatus();

	return (
		<Button
			className={cn('py-[10px]', className)}
			htmlType="submit"
			disabled={pending}
			loading={pending}
			data-testid={dataTestId}
			icon={icons}
			{...props}
		>
			{children}
		</Button>
	);
};
export default SubmitButton;
