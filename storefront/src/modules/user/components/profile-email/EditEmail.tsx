import { Button } from '@/components/Button';
import { Customer } from '@medusajs/medusa';
import { Form, message } from 'antd';
import { useRouter } from 'next/navigation';
import { updateCustomerEmail } from '../../actions';
import { useEffect } from 'react';
import { Input } from '@/components/Input';
import { useCustomer } from '@/lib/providers/user/user-provider';

type TCustomer = {
  onClose: () => void;
  state: boolean;
};

const EditEmail = ({ onClose, state }: TCustomer) => {
  const { setCustomer } = useCustomer();
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    if (state) {
      form.resetFields();
    }
  }, [state, form]);

  const onFinish = async (values: any) => {
    try {
      const result = await updateCustomerEmail(values);
      if (result.success) {
        setCustomer((prev) => ({ ...prev, email: values.email } as Customer));
        message.success('Cập nhật email thành công!');
        onClose();
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      message.error(
        error.message ||
          'Cập nhật email thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name='email'
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input
          placeholder='Nhập Email'
          type='email'
          required
          autoComplete='email'
        />
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          className='flex items-center justify-center w-full rounded-none text-lg uppercase px-4 py-6 font-bold'
        >
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditEmail;
