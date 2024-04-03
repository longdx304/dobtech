import MUICard from '@mui/material/Card';
import { cn } from '@/lib/utils';

interface Props {
	className?: string;
}
export default function Card({ className, children }: Props) {
	return (
		<MUICard variant="outlined" className={cn('p-8 shadow-lg', className)}>
			{children}
		</MUICard>
	);
}
