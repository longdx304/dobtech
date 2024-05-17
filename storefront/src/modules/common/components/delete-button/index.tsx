import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { deleteLineItem } from '@/modules/cart/action';
import { Loader, Trash } from 'lucide-react';
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

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteLineItem(id).catch((err) => {
      setIsDeleting(false);
    });
  };

  return (
    <div className={cn('', className)}>
      <Button
        className='flex gap-x-1 cursor-pointer bg-transparent shadow-none'
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Loader className='animate-spin' /> : <Trash />}
        <span>{children}</span>
      </Button>
    </div>
  );
};

export default DeleteButton;
