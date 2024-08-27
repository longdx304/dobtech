'use client';

import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditEmail from './EditEmail';
import { useCustomer } from '@/lib/providers/user/user-provider';

const ProfileEmail = () => {
  const { state, onOpen, onClose } = useToggleState(false);
  const { customer } = useCustomer();
  const router = useRouter();

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
        <Text className='text-lg font-bold flex-1 text-center'>E-Mail</Text>
        <div className='w-[36px]' />
      </Flex>

      <Flex className='flex-col text-center px-6 pt-16 pb-32'>
        <Text>Email ràng buộc</Text>
        <Text className='pt-4 text-base font-bold'>{customer?.email}</Text>
      </Flex>

      <Flex className='px-6 py-3'>
        <Button
          type='default'
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
        title='Email mới'
        onClose={onClose}
        className='[&_.ant-drawer-title]:flex [&_.ant-drawer-title]:justify-center [&_.ant-drawer-title]:items-center'
      >
        <EditEmail onClose={onClose} state={state} />
      </Drawer>
    </>
  );
};

export default ProfileEmail;
