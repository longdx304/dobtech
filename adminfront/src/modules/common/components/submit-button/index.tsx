import Button from '@mui/material/Button';
import { React } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';

const SubmitButton = (
	{
		variant = 'contained',
		className,
		'data-testid': dataTestId,
		children,
		...props
	}: {
		variant?: 'contained' | 'outlined' | 'text' | null;
		className?: string;
		'data-testid'?: string;
		children: React.ReactNode;
	}
) => {
	const { pending } = useFormStatus();

	return (
		<Button
			// size="large"
			className={cn('py-[10px]', className)}
			type="submit"
			disabled={pending}
			variant={variant}
			data-testid={dataTestId}
			{...props}
		>
			{children}
		</Button>
	);
};
export default SubmitButton;
