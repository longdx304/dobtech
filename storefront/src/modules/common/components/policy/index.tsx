import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import LocalizedClientLink from '../localized-client-link';

const Policy = () => {
  return (
    <Flex className='pt-4 pb-4 px-4 flex-col bg-[#F6F6F6]'>
      <Flex align='center' justify='space-between' className='mb-4 w-full'>
        <Text className='text-[14px] font-bold'>
          Chính sách
        </Text>
        <ChevronDown color='#767676' size={20} />
      </Flex>

      <Flex className='flex-col gap-4'>
        <LocalizedClientLink href='/'>
          <Text className='text-[14px] '>Thông tin vận chuyển</Text>
        </LocalizedClientLink>
        <LocalizedClientLink href='/'>
          <Text className='text-[14px]'>Thanh toán khi nhận hàng</Text>
        </LocalizedClientLink>
        <LocalizedClientLink href='/'>
          <Text className='text-[14px]'>Chính sách đổi trả</Text>
        </LocalizedClientLink>
        <LocalizedClientLink href='/'>
          <Text className='text-[14px]'>Hướng dẫn thanh toán</Text>
        </LocalizedClientLink>
        <LocalizedClientLink href='/'>
          <Text className='text-[14px]'>Trung tâm bảo mật</Text>
        </LocalizedClientLink>
      </Flex>
    </Flex>
  );
};

export default Policy;
