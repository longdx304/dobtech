import { Flex } from '@/components/Flex';
import { ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { useState } from 'react';
import DrawFilter from './DrawFilter';

type FilterRadioGroupProps = {
  items: {
    value: string;
    label: string;
  }[];
  value: any;
  handleChange: (...args: any[]) => void;
  'data-testid'?: string;
};

const FilterRadioGroup = ({
  items,
  value,
  handleChange,
  'data-testid': dataTestId,
}: FilterRadioGroupProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Flex align='center' className='w-full flex space-x-4 justify-between lg:justify-end'>
      {items
        .filter((item) => item.value === 'created_at')
        .map((item) => (
          <div
            key={item.value}
            className={`${value === item.value && 'text-black font-bold'}`}
            onClick={() => handleChange(item.value)}
          >
            {item.label}
          </div>
        ))}
      <Flex
        className={`${
          value === 'price_asc' || value === 'price_desc'
            ? 'text-black font-bold'
            : 'text-gray-900'
        }`}
        onClick={() =>
          handleChange(value === 'price_asc' ? 'price_desc' : 'price_asc')
        }
      >
        Giá{' '}
        {value === 'price_asc' ? (
          <ArrowUp className='h-5 w-5' />
        ) : (
          <ArrowDown className='h-5 w-5' />
        )}
      </Flex>
      <Flex
        className='flex bg-white shadow-none hover:border-slate-500'
        onClick={() => setOpen(!open)}
      >
        <span>Sàng lọc</span>
        <Filter className='h-5 w-5 text-black' />
      </Flex>
      <DrawFilter open={open} onClose={() => setOpen(false)} />
    </Flex>
  );
};

export default FilterRadioGroup;
