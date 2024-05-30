import { Col, Row } from 'antd';
import { ChevronRight } from 'lucide-react';
import { FC } from 'react';

import { Avatar } from '@/components/Avatar';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { cn } from '@/lib/utils';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { TTreeCategories } from '@/types/productCategory';
import Policy from '../policy';

type Props = {
  categories: TTreeCategories[] | null;
  activeItem: string | null;
  handleMouseEnter: (categoryId: string) => void;
  handleCategoryClick: (categoryId: string) => void;
  selectedCategory: string | null;
  handleBackClick: () => void;
  isMobile?: boolean;
};

const CategoryMobile: FC<Props> = ({
  categories,
  activeItem,
  handleMouseEnter,
  handleCategoryClick,
  selectedCategory,
  handleBackClick,
  isMobile = false,
}) => {
  return (
    <Row className='relative overflow-hidden transition-transform duration-300 h-full'>
      <Col
        span={24}
        className={cn(
          'transform transition-transform duration-300 flex flex-col justify-between overflow-hidden',
          selectedCategory ? '-translate-x-full h-0' : 'translate-x-0 h-full'
        )}
      >
        {!selectedCategory && (
          <>
            <CategoryNav
              categories={categories}
              activeItem={activeItem!}
              handleMouseEnter={handleMouseEnter}
              isMobile={isMobile}
              handleCategoryClick={handleCategoryClick}
            />
            <Policy />
          </>
        )}
      </Col>
      <Col
        span={24}
        className={cn(
          'transform transition-transform duration-300 border-l border-slate-200/80 pl-6 overflow-hidden',
          selectedCategory ? 'translate-x-0 h-full' : 'translate-x-full h-0'
        )}
      >
        {selectedCategory && (
          <CategoryGroup
            categories={categories!}
            activeItem={selectedCategory}
            handleBackClick={handleBackClick}
          />
        )}
      </Col>
    </Row>
  );
};

export default CategoryMobile;

const CategoryNav = ({
  categories,
  activeItem,
  handleMouseEnter,
  handleCategoryClick,
  isMobile = false,
}: {
  categories: TTreeCategories[] | null;
  activeItem: string;
  handleMouseEnter: (categoryId: string) => void;
  handleCategoryClick: (categoryId: string) => void;
  isMobile?: boolean;
}) => {
  const url = 'https://ananas.vn/wp-content/uploads/Pro_AV00205_1.jpeg';

  return (
    <Flex vertical className='w-full'>
      {categories?.map((category) =>
        isMobile ? (
          <div key={category.id}>
            <Flex
              onMouseEnter={() => handleMouseEnter(category.id)}
              onClick={() => handleCategoryClick(category.id)}
              justify='space-between'
              align='center'
              className={cn(
                'group w-full cursor-pointer hover:bg-slate-200/30 rounded-[8px] py-2 pr-2 pl-6 box-border transition-all',
                activeItem === category.id && 'bg-slate-200/30'
              )}
            >
              <Flex align='center' gap={8}>
                <Avatar size={54} src={url}>
                  {category.label}
                </Avatar>
                <span className='text-[#666666] text-[11px]'>
                  {formattedText(category.label)}
                </span>
              </Flex>
              <ChevronRight
                className={cn(
                  'group-hover:translate-x-1',
                  activeItem === category.id && 'translate-x-1'
                )}
                color='#767676'
                size={20}
              />
            </Flex>
          </div>
        ) : (
          <LocalizedClientLink
            href={`categories/${category.key}`}
            key={category.id}
          >
            <Flex
              onMouseEnter={() => handleMouseEnter(category.id)}
              justify='space-between'
              align='items-center'
              className={cn(
                'group w-full cursor-pointer hover:bg-slate-200/30 rounded-[8px] py-2 px-2 box-border transition-all',
                activeItem === category.id && 'bg-slate-200/30'
              )}
              onClick={() => handleCategoryClick(category.id)}
            >
              <Text className='text-[12px] text-[#666666] font-normal'>
                {category.label}
              </Text>
              <ChevronRight
                className={cn(
                  'group-hover:translate-x-1',
                  activeItem === category.id && 'translate-x-1'
                )}
                color='#767676'
                size={20}
              />
            </Flex>
          </LocalizedClientLink>
        )
      )}
    </Flex>
  );
};

const CategoryGroup = ({
  categories,
  activeItem,
  handleBackClick,
}: {
  categories: TTreeCategories[] | null;
  activeItem: string | null;
  handleBackClick: () => void;
}) => {
  const url = 'https://ananas.vn/wp-content/uploads/Pro_AV00205_1.jpeg';

  return (
    <Flex gap='middle' className='w-full'>
      {categories?.map(
        (category) =>
          category.id === activeItem &&
          category.children &&
          category.children.length > 0 && (
            <Flex
              className='w-full flex-wrap'
              key={category.id}
              gap='middle'
              justify='start'
              align='center'
            >
              {category.children.map((child) => (
                <Flex
                  key={child.id}
                  vertical
                  gap='small'
                  align='center'
                  className='cursor-pointer'
                  onClick={handleBackClick}
                >
                  <LocalizedClientLink href={`categories/${child.key}`}>
                    <div className='flex items-center flex-col gap-1'>
                      <Avatar size={64} src={url}>
                        {child.label.toUpperCase().substring(0, 2)}
                      </Avatar>
                      <span className='text-[#666666] text-[11px]'>
                        {formattedText(child.label)}
                      </span>
                    </div>
                  </LocalizedClientLink>
                </Flex>
              ))}
            </Flex>
          )
      )}
    </Flex>
  );
};

const formattedText = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
