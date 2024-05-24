'use client';

import React from 'react';
import { Input } from 'antd';
import { useRouter } from 'next/navigation';

const { Search } = Input;

const SearchInput = () => {
  const router = useRouter();

  const onSearch = (value: string) => {
    console.log(value);
    router.push(`/search/${value}`);
  }

  return (
    <>
      <Search
        className='[&_.ant-input-outlined:focus]:shadow-none max-w-[300px]'
        placeholder='Tìm kiếm'
        onSearch={onSearch}
        enterButton
      />
    </>
  );
};

export default SearchInput;
