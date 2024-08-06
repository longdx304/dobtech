'use client';

import { Button } from '@/components/Button';
import { Input, InputPassword } from '@/components/Input';
import { Form, FormProps, message } from 'antd';
import { Lock, Mail, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUp } from '../../actions';
import { LOGIN_VIEW } from '../../templates/login-template';
import { ERoutes } from '@/types/routes';

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void;
  onCloseDrawer?: () => void;
  isDesktop: boolean;
};

type RegisterProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

const Register = ({ setCurrentView, onCloseDrawer, isDesktop }: Props) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish: FormProps<RegisterProps>['onFinish'] = async (values) => {
    console.log('values onFinish:', values);
    try {
      await signUp(values);
      message.success('Đăng ký thành công!');
      if (!isDesktop) {
        router.refresh();
        onCloseDrawer?.();
      } else {
        router.push(`/${ERoutes.USER}`);
      }
    } catch (error: any) {
      message.error(
        error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

  return (
    <div className='register-form flex flex-col items-center'>
      <h1 className='text-large-semi uppercase mt-0'>CHAMDEP</h1>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          labelCol={{ span: 24 }}
          name='firstName'
          rules={[
            {
              required: true,
              message: 'Họ phải được nhập!',
            },
          ]}
          label='Họ:'
        >
          <Input
            placeholder='Họ'
            prefix={<User size={20} color='rgb(156 163 175)' />}
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          name='lastName'
          rules={[
            {
              required: true,
              message: 'Tên phải được nhập!',
            },
          ]}
          label='Tên:'
        >
          <Input
            placeholder='Tên'
            prefix={<User size={20} color='rgb(156 163 175)' />}
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          name='email'
          rules={[
            { type: 'email', message: 'Email không đúng định dạng!' },
            {
              required: true,
              whitespace: true,
              message: 'Email phải được nhập!',
            },
          ]}
          label='Email:'
        >
          <Input
            placeholder='Email'
            prefix={<Mail size={20} color='rgb(156 163 175)' />}
            data-testid='email'
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          name='phone'
          rules={[
            {
              required: true,
              message: 'Số điện thoại phải được nhập!',
              pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
            },
          ]}
          label='Số điện thoại:'
        >
          <Input
            placeholder='Số điện thoại'
            prefix={<Phone size={20} color='rgb(156 163 175)' />}
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          name='password'
          rules={[
            { required: true, message: 'Mật khẩu phải có ít nhất 2 ký tự!' },
          ]}
          label='Mật khẩu:'
        >
          <InputPassword
            placeholder='Mật khẩu'
            prefix={<Lock size={20} color='rgb(156 163 175)' />}
            data-testid='password'
          />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='register-form-button mb-4'
          >
            Đăng ký
          </Button>
          <a onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}>
            Đã có tài khoản? Đăng nhập ngay
          </a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;