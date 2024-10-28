import { cn } from '@/lib/utils';
import AntSearchInput, { SearchProps } from 'antd/es/input/Search';

interface Props extends SearchProps {
	className?: string;
	ref?: any;
}

export default function SearchInput({ className, ref, ...props }: Props) {
	return <AntSearchInput className={cn('p-3 gap-2', className)} {...props} ref={ref} />;
}
