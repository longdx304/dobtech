import { FC, useState } from 'react';

import Drawer from '@/components/Drawer/Drawer';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { TTreeCategories } from '@/types/productCategory';
import { ChevronLeft, Headphones, Heart, Home, User } from 'lucide-react';
import CategoryMobile from '../category-menu/CategoryMobile';

interface Props {
  open: boolean;
  onClose: () => void;
  categories: TTreeCategories[] | null;
}

const DrawCategory: FC<Props> = ({ open, onClose, categories }) => {
  const [hoveredItem, setHoveredItem] = useState<string>(
    categories?.[0]?.id || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleMouseEnter = (categoryId: string) => {
    setHoveredItem(categoryId);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };
  const titleMobileWrap = (
    <Flex align='center'>
      {selectedCategory && (
        <ChevronLeft
          onClick={handleBackClick}
          color='#767676'
          size={24}
          className='cursor-pointer mr-2'
        />
      )}
      <Flex align='center' className='w-full' justify='center'>
        <Text>
          {selectedCategory ? '' : 'Danh mục'}
          {selectedCategory
            ? categories?.find((c) => c.id === selectedCategory)?.label
            : ''}
        </Text>
      </Flex>
    </Flex>
  );

  const footerMobileWrap = (
    <Flex className='bg-white py-2 border-t border-gray-200 justify-around'>
      <Home className='text-gray-600' size={24} />
      <Heart className='text-gray-600' size={24} />
      <Headphones className='text-gray-600' size={24} />
      <User className='text-gray-600' size={24} />
    </Flex>
  );

  return (
    <Drawer
      placement='left'
      title={titleMobileWrap}
      footer={footerMobileWrap}
      onClose={onClose}
      open={open}
      className='[&_.ant-drawer-body]:p-0 [&_.ant-drawer-header-title]:flex-row-reverse'
    >
      <CategoryMobile
        categories={categories}
        activeItem={hoveredItem!}
        handleMouseEnter={handleMouseEnter}
        handleCategoryClick={handleCategoryClick}
        selectedCategory={selectedCategory}
        handleBackClick={handleBackClick}
        isMobile={true}
      />
    </Drawer>
  );
};

export default DrawCategory;
