'use client';

import { Avatar, Col, Row } from 'antd';
import { ChevronRight } from 'lucide-react';
import React, { FC, useMemo, useState } from 'react';

import { Dropdown } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { cn } from '@/lib/utils';
import { TTreeCategories } from '@/types/productCategory';
import LocalizedClientLink from '../localized-client-link';

interface Props {
  categories: TTreeCategories[] | null;
}

const Category: FC<Props> = ({ categories }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleMouseEnter = (categoryId: string) => {
    setHoveredItem(categoryId); // Set state khi hover vào item
  };

  const dropdownRender = useMemo(() => {
    return (
      <div className='w-full bg-slate-50 shadow-xl py-4'>
        <div className='container'>
          <Row className='' gutter={[16, 0]}>
            <Col span={5}>
              <CategoryNav
                categories={categories}
                activeItem={hoveredItem!}
                handleMouseEnter={handleMouseEnter}
              />
            </Col>
            <Col span={19} className='border-l border-slate-200/80'>
              <CategoryGroup
                categories={categories!}
                hoveredItem={hoveredItem}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredItem]);

  return (
    <Dropdown
      overlayStyle={{ width: '100%', left: '0px' }}
      className='category'
      dropdownRender={(menu) => dropdownRender}
    >
      <Flex>
        {categories?.map((category) => (
          <Text
            className={cn(
              'text-[13px] text-[#666666] text font-normal cursor-pointer hover:bg-slate-100 rounded-t-[6px] py-2 px-2'
            )}
            key={category.id}
            onMouseEnter={() => handleMouseEnter(category.id)}
          >
            <LocalizedClientLink
              href={`categories/${category.key}`}
              className='text-[#666666]'
            >
              {category.label}
            </LocalizedClientLink>
          </Text>
        ))}
      </Flex>
    </Dropdown>
  );
};

export default Category;

const CategoryNav = ({
  categories,
  activeItem,
  handleMouseEnter,
}: {
  categories: TTreeCategories[] | null;
  activeItem: string;
  handleMouseEnter: (categoryId: string) => void;
}) => {
  return (
    <Flex vertical className='w-full'>
      {categories?.map((category) => (
        <Flex
          onMouseEnter={() => handleMouseEnter(category.id)}
          justify='space-between'
          align='items-center'
          className={cn(
            'group w-full cursor-pointer hover:bg-slate-200/30 rounded-[8px] py-2 px-2 box-border transition-all',
            activeItem === category.id && 'bg-slate-200/30'
          )}
          key={category.id}
        >
          <LocalizedClientLink href={`categories/${category.key}`}>
            <Text className='text-[12px] text-[#666666] font-normal'>
              {category.label}
            </Text>
          </LocalizedClientLink>
          <ChevronRight
            className={cn(
              'group-hover:translate-x-1',
              activeItem === category.id && 'translate-x-1'
            )}
          />
        </Flex>
      ))}
    </Flex>
  );
};

const CategoryGroup = ({
  categories,
  hoveredItem,
}: {
  categories: TTreeCategories[] | null;
  hoveredItem: string | null;
}) => {
  return (
    <Flex gap='middle' className='w-full'>
      {categories?.map(
        (category) =>
          category.id === hoveredItem &&
          category.children &&
          category.children.length > 0 && (
            <React.Fragment key={category.id}>
              {category.children.map((child) => (
                <Flex
                  key={child.id}
                  vertical
                  gap='small'
                  align='center'
                  className='cursor-pointer'
                >
                  <LocalizedClientLink href={`categories/${child.key}`}>
                    <Avatar>{child.label.toUpperCase().substring(0, 2)}</Avatar>
                  </LocalizedClientLink>
                </Flex>
              ))}
            </React.Fragment>
          )
      )}
    </Flex>
  );
};
