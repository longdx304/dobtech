'use client';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { InputPassword } from '@/components/Input';
import { Text } from '@/components/Typography';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { Form, FormProps, message } from 'antd';
import { ChevronLeft, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateCustomerPassword } from '../../actions';

type ProfilePasswordProps = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

const ProfilePassword = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { customer } = useCustomer();

  const onFinish: FormProps<ProfilePasswordProps>['onFinish'] = async (
    values
  ) => {
    try {
      await updateCustomerPassword(customer!, values);
      message.success('Cập nhật mật khẩu thành công!');
      router.push('/user/setting');
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
          Đổi mật khẩu
        </Text>
        <div className='w-[36px]' />
      </Flex>

      <Form form={form} onFinish={onFinish} className='w-full p-3'>
        <Form.Item
          name='old_password'
          rules={[
            { required: true, message: 'Mật khẩu phải có ít nhất 2 ký tự!' },
          ]}
        >
          <InputPassword
            placeholder='Mật khẩu cũ'
            prefix={<Lock size={20} color='rgb(156 163 175)' />}
          />
        </Form.Item>
        <Form.Item
          name='new_password'
          rules={[
            { required: true, message: 'Mật khẩu phải có ít nhất 2 ký tự!' },
          ]}
        >
          <InputPassword
            placeholder='Mật khẩu mới'
            prefix={<Lock size={20} color='rgb(156 163 175)' />}
          />
        </Form.Item>
        <Form.Item
          name='confirm_password'
          rules={[
            { required: true, message: 'Mật khẩu phải có ít nhất 2 ký tự!' },
          ]}
        >
          <InputPassword
            placeholder='Xác nhận mật khẩu'
            prefix={<Lock size={20} color='rgb(156 163 175)' />}
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

export default ProfilePassword;
