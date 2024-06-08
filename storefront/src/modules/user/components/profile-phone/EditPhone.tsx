import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Text } from '@/components/Typography';
import { Customer } from '@medusajs/medusa';
import { Form, message } from 'antd';
import { Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { updateCustomerPhone } from '../../actions';
import { useCustomer } from '@/lib/providers/user/user-provider';

type EditPhoneProps = {
  onClose: () => void;
  state: boolean;
  customer: Omit<Customer, 'password_hash'> | null;
};

const EditPhone = ({ onClose, state, customer }: EditPhoneProps) => {
  const [form] = Form.useForm();
  const { setCustomer } = useCustomer();
  const router = useRouter();

  useEffect(() => {
    if (state) {
      form.resetFields();
    }
  }, [state, form]);

  const onFinish = async (values: any) => {
    try {
      const result = await updateCustomerPhone(values);
      if (result.success) {
        setCustomer((prev) => ({ ...prev, phone: values.phone } as Customer));
        message.success('Cập nhật số điện thoại thành công!');
        onClose();
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      message.error(
        error.message ||
          'Cập nhật số điện thoại thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

  return (
    <Flex className='flex-col'>
      <Flex className='flex-col'>
        <Text className='mb-3'>Số điện thoại ban đầu</Text>
        <Flex className='flex items-center h-[40px] bg-[#f6f6f6] border-1 border-solid border-[#e5e5e5] mb-3 px-3'>
          <Text className='font-bold text-sm'>{customer?.phone}</Text>
        </Flex>
      </Flex>

      <Flex className='flex-col pt-8 '>
        <Text className='pb-3'>Số điện thoại mới</Text>

        <Form form={form} onFinish={onFinish}>
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
          >
            <Input
              placeholder='Số điện thoại'
              prefix={<Phone size={20} color='rgb(156 163 175)' />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='w-full rounded-none text-lg uppercase font-bold'
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
};

export default EditPhone;
