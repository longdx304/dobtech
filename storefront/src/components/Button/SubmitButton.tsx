import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props {
	className?: string;
	'data-testid'?: string;
	children: ReactNode;
	icons?: ReactNode;
}

const SubmitButton = ({
	className,
	'data-testid': dataTestId,
	children,
	icons,
	...props
}: Props) => {
	return (
		<Button
			className={cn('py-[10px]', className)}
			htmlType="submit"
			data-testid={dataTestId}
			icon={icons}
			{...props}
		>
			{children}
		</Button>
	);
};
export default SubmitButton;
