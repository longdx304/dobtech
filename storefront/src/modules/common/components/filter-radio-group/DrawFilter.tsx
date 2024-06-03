import { Drawer } from '@/components/Drawer';
import { cn } from '@/lib/utils';
import { Empty } from 'antd';
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
      <Empty
        className='pt-8'
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description='Không có biến thể'
      />
    </Drawer>
  );
};

export default DrawFilter;
