import { Button } from '@/components/Button';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { cn } from '@/lib/utils';
import { deleteLineItem } from '@/modules/cart/action';
import { Loader, Trash2 } from 'lucide-react';
import { useState } from 'react';

const DeleteButton = ({
	id,
	children,
	className,
}: {
	id: string;
	children?: React.ReactNode;
	className?: string;
}) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const { refreshCart } = useCart();

	const handleDelete = async (id: string) => {
		setIsDeleting(true);
		await deleteLineItem(id).catch((err) => {
			setIsDeleting(false);
		});

		refreshCart();
	};

	return (
		<div className={cn('', className)}>
			<Button
				className="flex gap-x-1 cursor-pointer bg-transparent shadow-none p-0 h-auto"
				onClick={() => handleDelete(id)}
			>
				{isDeleting ? (
					<Loader className="animate-spin text-black" />
				) : (
					<Trash2 size={16} className="text-black" />
				)}
				{children && <span>{children}</span>}
			</Button>
		</div>
	);
};

export default DeleteButton;
