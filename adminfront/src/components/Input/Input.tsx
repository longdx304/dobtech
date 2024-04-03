import TextField from '@mui/material/TextField';
import { cn } from '@/lib/utils';

interface Props {
	className?: string;
}

export default function Input({ className, ...props }: Props) {
	return <TextField className={cn('', className)} {...props} />;
}
