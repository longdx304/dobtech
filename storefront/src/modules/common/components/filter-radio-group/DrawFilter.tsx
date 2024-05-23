import Drawer from '@/components/Draw/Draw';
import { Empty } from '@/components/Empty';
import { cn } from '@/lib/utils';
import { FC } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const DrawFilter: FC<Props> = ({ open, onClose }) => {
  return (
    <Drawer
      placement='right'
      title='Sàng lọc'
      onClose={onClose}
      open={open}
      className={cn(
        '[&_.ant-drawer-body]:p-0',
        '[&_.ant-drawer-title]:w-full [&_.ant-drawer-title]:flex [&_.ant-drawer-title]:justify-center'
      )}
    >
      <Empty className='pt-8' />
    </Drawer>
  );
};

export default DrawFilter;
