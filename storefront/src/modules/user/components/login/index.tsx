import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Input, InputPassword } from '@/components/Input';
import { Form, FormProps, message } from 'antd';
import { Lock, Mail } from 'lucide-react';
import { logCustomerIn } from '../../actions';
import { LOGIN_VIEW } from '../../templates/login-template';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void;
  onCloseDrawer?: () => void;
  isDesktop: boolean;
};

type LoginProps = {
  email: string;
  password: string;
};

const Login = ({ setCurrentView, onCloseDrawer, isDesktop }: Props) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish: FormProps<LoginProps>['onFinish'] = async (values) => {
    try {
      await logCustomerIn(values);
      message.success('Đăng nhập thành công!');
      if (!isDesktop) {
        onCloseDrawer?.();
      } else {
        router.push(`/${ERoutes.USER}`);
      }
    } catch (error: any) {
      message.error(
        error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

  return (
    <div className='login-form flex flex-col items-center'>
      <h1 className='text-large-semi uppercase'>CHAMDEP</h1>
      <Form form={form} onFinish={onFinish}>
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
          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className='login-form-forgot' href=''>
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button mb-4'
          >
            Đăng nhập
          </Button>
          hoặc{' '}
          <a onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}>
            Đăng ký ngay
          </a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
