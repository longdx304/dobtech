import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { Space } from 'antd';
import { ArrowDown, Filter } from 'lucide-react';

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
  console.log('value:', value);

  return (
    <>
      <div className='flex items-center'>
        <Dropdown
          menu={{ selectedKeys: [value] }}
          dropdownRender={(menu) => (
            <ul className='space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900 list-none'>
              {items.map((item) => (
                <li key={item.value}>
                  <a
                    onClick={() => handleChange(item.value)}
                    className='text-black'
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          className='cursor-pointer'
          data-testid={dataTestId}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Sort by <ArrowDown />
            </Space>
          </a>
        </Dropdown>

        <Button className='-m-2 ml-4 bg-white shadow-none hover:border-slate-500'>
          <Filter className='h-5 w-5' />
        </Button>
      </div>
    </>
  );
};

export default FilterRadioGroup;
