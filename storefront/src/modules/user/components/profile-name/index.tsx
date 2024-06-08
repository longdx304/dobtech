'use client';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Text } from '@/components/Typography';
import { Customer } from '@medusajs/medusa';
import { Form, message } from 'antd';
import { ChevronLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateCustomerName } from '../../actions';
import { useCustomer } from '@/lib/providers/user/user-provider';

const ProfileName = () => {
  const { customer, setCustomer } = useCustomer();
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const result = await updateCustomerName(values);
      if (result.success) {
        setCustomer(
          (prev) =>
            ({
              ...prev,
              first_name: values.firstName,
              last_name: values.lastName,
            } as Customer)
        );
        message.success('Cập nhật họ tên thành công!');
        router.back();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      message.error(
        error.message ||
          'Cập nhật họ tên thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

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
        <Text className='text-lg font-bold flex-1 text-center'>
          Cài đặt tài khoản
        </Text>
        <div className='w-[36px]' />
      </Flex>

      <Form form={form} onFinish={onFinish} className='w-full p-3'>
        <Form.Item
          name='firstName'
          rules={[
            {
              required: true,
              message: 'Họ phải được nhập!',
            },
          ]}
          label='Họ:'
          initialValue={customer?.first_name}
        >
          <Input
            placeholder='Họ'
            prefix={<User size={20} color='rgb(156 163 175)' />}
          />
        </Form.Item>
        <Form.Item
          name='lastName'
          rules={[
            {
              required: true,
              message: 'Tên phải được nhập!',
            },
          ]}
          label='Tên:'
          initialValue={customer?.last_name}
        >
          <Input
            placeholder='Tên'
            prefix={<User size={20} color='rgb(156 163 175)' />}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='flex items-center justify-center w-full rounded-none text-lg uppercase px-4 py-6 font-bold'
          >
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProfileName;
