import { FC, useState } from 'react';
import { Drawer } from 'antd';

import { TTreeCategories } from '@/types/productCategory';
import CategoryMenu from '@/modules/common/components/category-menu';

interface Props {
  open: boolean;
  onClose: () => void;
  categories: TTreeCategories[] | null;
}

const DrawCategory: FC<Props> = ({ open, onClose, categories }) => {
  const [hoveredItem, setHoveredItem] = useState<string>(
    categories?.[0]?.id || ''
  );

  const handleMouseEnter = (categoryId: string) => {
    setHoveredItem(categoryId); // Set state khi hover vào item
  };

  return (
    <Drawer
      placement='left'
      title='Danh mục'
      onClose={onClose}
      open={open}
      className='[&_.ant-drawer-body]:p-0'
    >
      <CategoryMenu
        categories={categories}
        activeItem={hoveredItem!}
        handleMouseEnter={handleMouseEnter}
        isMobile={true}
      />
    </Drawer>
  );
};

export default DrawCategory;
