'use client';

import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EditPhone from './EditPhone';

const ProfilePhone = () => {
  const { customer } = useCustomer();
  const router = useRouter();
  const { state, onOpen, onClose } = useToggleState(false);

  return (
    <>
      <Flex
        align='center'
        justify='space-between'
        style={{ borderBottom: '2px solid #f6f6f6' }}
        className='pb-2'
      >
        <div className='flex' onClick={() => router.back()}>
          <ChevronLeft size={24} className='text-[#767676] pl-[12px]' />
        </div>
        <Text className='text-lg font-bold flex-1 text-center capitalize'>
          Thay đổi số điện thoại
        </Text>
        <div className='w-[36px]' />
      </Flex>

      <Flex className='p-5 flex-col'>
        <Flex className='flex-col' align='center' justify='center'>
          <Image
            src='/images/phone.png'
            alt='Phone'
            width={72}
            height={72}
            className='mt-5 mb-3'
          />
          <Text className='!text-md'>Số điện thoại</Text>
        </Flex>

        <Flex className='w-full my-5 flex justify-center items-center h-[40px] bg-[#f6f6f6] border-1 border-solid border-[#e5e5e5]'>
          <Text className='font-bold text-sm'>{customer?.phone}</Text>
        </Flex>

        <Button
          type='primary'
          htmlType='submit'
          className='flex items-center justify-center w-full rounded-none text-lg uppercase px-4 py-6 font-bold'
          onClick={onOpen}
        >
          Thay đổi
        </Button>
      </Flex>

      {/* Drawer */}
      <Drawer
        open={state}
        styles={{
          wrapper: { height: '100%', width: '100%' },
        }}
        title='Số điện thoại mới'
        onClose={onClose}
        className='[&_.ant-drawer-title]:flex [&_.ant-drawer-title]:justify-center [&_.ant-drawer-title]:items-center'
      >
        <EditPhone onClose={onClose} state={state} />
      </Drawer>
    </>
  );
};

export default ProfilePhone;
