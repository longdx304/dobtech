// @ts-nocheck
'use client';
import { Collapse } from '@/components/Collapse';
import { CollapseProps } from 'antd/lib';
import React from 'react';

type OptionListProps = {
  color: any;
  size: any;
};

const OptionList = ({ color, size }: OptionListProps) => {
  const colorItems: CollapseProps['items'] = [
    {
      key: 'color',
      label: 'Màu sắc',
      children: (
        <ul className='space-y-4'>
          {color.options.map((option, optionIdx) => (
            <li key={option.value} className='flex items-center'>
              <input
                type='checkbox'
                id={`color-${optionIdx}`}
                onChange={() => {}}
                // checked={filter.color.includes(option.value)}
                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              />
              <label
                htmlFor={`color-${optionIdx}`}
                className='ml-3 text-sm text-gray-600'
              >
                {option.label}
              </label>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const sizeItems: CollapseProps['items'] = [
    {
      key: 'size',
      label: 'Kích thước',
      children: (
        <ul className='space-y-4'>
          {size.options.map((option, optionIdx) => (
            <li key={option.value} className='flex items-center'>
              <input
                type='checkbox'
                id={`size-${optionIdx}`}
                onChange={() => {}}
                // checked={filter.size.includes(option.value)}
                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              />
              <label
                htmlFor={`size-${optionIdx}`}
                className='ml-3 text-sm text-gray-600'
              >
                {option.label}
              </label>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      <Collapse ghost items={colorItems} expandIconPosition='right' />
      <Collapse ghost items={sizeItems} expandIconPosition='right' />
    </>
  );
};

export default OptionList;
