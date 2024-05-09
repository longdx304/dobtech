import { ProductOption } from '@medusajs/medusa';
import React from 'react';

import { cn } from '@/lib/utils';
import { onlyUnique } from '@/lib/utils/only-unique';
import { Button } from '@/components/Button';
import { Check } from 'lucide-react';
import Image from 'next/image';

type OptionSelectProps = {
  option: ProductOption;
  current: string;
  updateOption: (option: Record<string, string>) => void;
  title: string;
  disabled: boolean;
  'data-testid'?: string;
};

const titleMapping: { [key: string]: string } = {
  Size: 'Kích thước',
  Color: 'Màu sắc',
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  'data-testid': dataTestId,
  disabled,
}) => {
  const translatedTitle = titleMapping[title] || title;
  const filteredOptions = option.values.map((v) => v.value).filter(onlyUnique);

  return (
    <div className='flex flex-col gap-y-3'>
      <span className='text-sm'>{translatedTitle}</span>
      <div
        className='flex flex-wrap justify-between gap-2'
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <Button
              onClick={() => updateOption({ [option.id]: v })}
              key={v}
              className={cn(
                'bg-[#fff] border-[#ccc] border h-10 rounded-rounded p-2 flex-1 shadow-none text-black relative',

                {
                  'border-black border-2': v === current,
                  'hover:shadow-lg transition-shadow ease-in-out duration-150':
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid='option-button'
            >
              {v}
              {v === current && (
                <div className='box-tick bottom-0 right-0 absolute'>
                  <Image
                    alt='icon-tick-bold'
                    className='selected-tick b-0 r-0 absolute top-2'
                    src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/9057d6e718e722cde0e8.svg'
                    height={8}
                    width={8}
                  />
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionSelect;
