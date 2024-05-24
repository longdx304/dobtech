import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const items = [
  { value: 'size', label: 'Kích thước' },
  { value: 'color', label: 'Màu sắc' },
  { value: 'material', label: 'Vật liệu' },
  { value: 'component', label: 'Thành phần' },
  { value: 'pattern', label: 'Kiểu mẫu' },
  { value: 'style', label: 'Phong cách' },
];

const FilterVariant = () => {
  const [selected, setSelected] = useState('size');
  const [open, setOpen] = useState(false);

  const handleSelect = (value: any) => {
    setSelected(value);
  };

  return (
    <Flex className='pt-4 flex justify-center w-full'>
      <Swiper spaceBetween={10} slidesPerView={3}>
        {items.map((item) => (
          <SwiperSlide key={item.value} className='w-[115px]'>
            <Button
              role='button'
              aria-label={item.label}
              onClick={() => handleSelect(item.value)}
              type='default'
              className={`w-full ${
                selected === item.value &&
                'text-black font-bold bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{item.label}</span>
            </Button>
          </SwiperSlide>
        ))}
      </Swiper>
    </Flex>
  );
};

export default FilterVariant;
