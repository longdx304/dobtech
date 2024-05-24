'use client';
import { ChevronLeft } from 'lucide-react';

import { Flex } from '@/components/Flex';
import { SortOptions } from '@/modules/store/components/refinement-list/sort-products';
import { Input } from 'antd';
import { useRouter } from 'next/navigation';

const { Search } = Input;

type SearchModalProps = {
  sortBy?: SortOptions;
};

export default function SearchModal({ sortBy }: SearchModalProps) {
  const router = useRouter();

  const onSearch = (value: string) => {
    console.log(value);
    router.push(`/search/${value}`);
  };

  return (
    <>
      
      <Flex className='pt-4 px-4' justify='center' align='center' gap='small'>
        <ChevronLeft
          size={24}
          onClick={() => router.back()}
          className='cursor-pointer'
        />
        <Search
          className='[&_.ant-input-outlined:focus]:shadow-none'
          placeholder='Tìm kiếm'
          onSearch={onSearch}
          enterButton
        />
      </Flex>
    </>
  );
}
