import { React } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';

const SubmitButton = (
	{
		className,
		'data-testid': dataTestId,
		children,
		...props
	}: {
		className?: string;
		'data-testid'?: string;
		children: React.ReactNode;
	}
) => {
	const { pending } = useFormStatus();

	return (
		<Button
			className={cn('py-[10px]', className)}
			htmlType="submit"
			disabled={pending}
			loading={pending}
			data-testid={dataTestId}
			{...props}
		>
			{children}
		</Button>
	);
};
export default SubmitButton;
