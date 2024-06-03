import { Dropdown as AndtDropdown, DropDownProps } from 'antd';
import { cn } from '@/lib/utils';

export type Props = Partial<DropDownProps> & {
	className?: string;
};

export default function Dropdown({ className, children, ...props }: Props) {
	return (
		<AndtDropdown className={cn('w-full', className)} {...props}>
			{children}
		</AndtDropdown>
	);
}
