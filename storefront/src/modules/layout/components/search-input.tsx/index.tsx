'use client';
import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchInput = () => {
  return (
    <>
      <Search
        className='[&_.ant-input-outlined:focus]:shadow-none'
        placeholder='Tìm kiếm'
        onSearch={() => {}}
        enterButton
      />
    </>
  );
};

export default SearchInput;
