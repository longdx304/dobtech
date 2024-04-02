import { Button } from '@/components/ui/button';
import { React } from 'react';
import { useFormStatus } from 'react-dom';

const SubmitButton = ({
	children,
	variant = 'default',
	className,
	'data-testid': dataTestId,
}: {
	children: React.ReactNode;
	variant?: 'primary' | 'secondary' | 'transparent' | 'danger' | null;
	className?: string;
	'data-testid'?: string;
}) => {
	const { pending } = useFormStatus();

	return (
		<Button
			// size="large"
			className={className}
			type="submit"
			disabled={pending}
			variant={variant}
			data-testid={dataTestId}
		>
			{children}
		</Button>
	);
};
export default SubmitButton;
