import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { Input } from '@/components/Input';
import useToggleState from '@/lib/hooks/use-toggle-state';
import { Region } from '@/types/medusa';
import { Divider, Form, FormProps, Select, message } from 'antd';
import SelectAddress from './SelectAddress';
import { useEffect, useState } from 'react';
import {
  addCustomerShippingAddress,
  updateCustomerShippingAddress,
} from '../../actions';
import { Address } from '@medusajs/medusa';

type FormAddressProps = {
  region: Region;
  onClose: () => void;
  editingAddress: Address | null;
};

export type AddressProps = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  postalCode: string;
  countryCode: string;
};

const FormAddress = ({ region, onClose, editingAddress }: FormAddressProps) => {
  const [form] = Form.useForm();

  const {
    state: isAddressOpen,
    onOpen: onAddressOpen,
    onClose: onAddressClose,
  } = useToggleState(false);

  const [address, setAddress] = useState({
    province: '',
    district: '',
    ward: '',
  });

  useEffect(() => {
    if (editingAddress) {
      const {
        first_name,
        last_name,
        phone,
        address_1,
        address_2,
        city,
        province,
        postal_code,
        country_code,
      } = editingAddress;
      form.setFieldsValue({
        firstName: first_name,
        lastName: last_name,
        phone,
        ward: address_1,
        address: address_2,
        district: city,
        province,
        postalCode: postal_code,
        countryCode: country_code,
      });
    } else {
      form.resetFields();
    }
  }, [editingAddress, form]);

  const handleAddressSelect = (
    province: string,
    district: string,
    ward: string
  ) => {
    setAddress({ province, district, ward });
    form.setFieldsValue({ province, district, ward });
  };

  const onFinish: FormProps<AddressProps>['onFinish'] = async (values) => {
    try {
      if (editingAddress) {
        await updateCustomerShippingAddress(editingAddress.id, values);
        message.success('Đã cập nhật địa chỉ!');
        onClose();
        return;
      } else {
        await addCustomerShippingAddress(values);
        message.success('Đã thêm địa chỉ mới!');
        onClose();
      }
    } catch (error: any) {
      console.log('error', error);
      message.error(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ countryCode: region.countries[0].iso_2 }}
      >
        <Form.Item label='Quốc gia' name='countryCode'>
          <Select
            className='[&_.ant-select-selector]:!rounded-none'
            options={region.countries.map((country) => ({
              label: country.display_name,
              value: country.iso_2,
            }))}
            suffixIcon={null}
            size='large'
            disabled
          />
        </Form.Item>

        <Divider className='my-4' />

        <Form.Item
          label='Họ'
          name='firstName'
          rules={[{ required: true, message: 'Họ phải chứa 2-40 ký tự' }]}
        >
          <Input placeholder='Họ' className='rounded-none' />
        </Form.Item>

        <Form.Item
          label='Tên'
          name='lastName'
          rules={[{ required: true, message: 'Tên phải chứa 2-40 ký tự' }]}
        >
          <Input placeholder='Tên' className='rounded-none' />
        </Form.Item>

        <Form.Item
          label='Số điện thoại'
          name='phone'
          rules={[
            {
              required: true,
              pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
              message: 'Số điện thoại phải từ 10 đến 11 chữ số bắt đầu bằng 0.',
            },
          ]}
          help='Một số điện thoại hợp lệ là cần thiết để giao hàng.'
        >
          <Input placeholder='Số điện thoại' className='rounded-none' />
        </Form.Item>

        <Divider className='my-4' />

        <Form.Item
          label='Địa chỉ'
          name='address'
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          help='Vui lòng nhập bằng tiếng Việt tiêu chuẩn có dấu trọng âm.'
        >
          <Input
            placeholder='Địa chỉ đường phố ,căn hộ, Suĩte, Đơn vi,v.v.'
            className='rounded-none'
          />
        </Form.Item>

        <Form.Item
          label='Tỉnh/Thành phố'
          name='province'
          rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
        >
          <Input
            placeholder='Chọn tỉnh/thành phố'
            className='rounded-none'
            readOnly
            value={address.province}
            onClick={onAddressOpen}
          />
        </Form.Item>

        <Form.Item
          label='Quận/Huyện'
          name='district'
          rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
        >
          <Input
            placeholder='Chọn quận/huyện'
            className='rounded-none'
            value={address.district}
          />
        </Form.Item>

        <Form.Item
          label='Khu vực'
          name='ward'
          rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
        >
          <Input
            placeholder='Chọn khu vực'
            className='rounded-none'
            value={address.ward}
          />
        </Form.Item>

        <Form.Item
          label='Mã bưu điện'
          name='postalCode'
          rules={[{ required: true, message: 'Vui lòng chọn mã bưu điện' }]}
        >
          <Input placeholder='Chọn mã bưu điện' className='rounded-none' />
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

      {/* Drawer Select Address */}
      <Drawer
        title='Vui lòng chọn'
        open={isAddressOpen}
        onClose={onAddressClose}
        styles={{
          wrapper: { height: '100%', width: '100%' },
          body: { paddingTop: 0, paddingBottom: 0, overflow: 'hidden' },
        }}
        className='[&_.ant-drawer-title]:flex [&_.ant-drawer-title]:justify-center [&_.ant-drawer-title]:items-center'
      >
        <SelectAddress
          address={address}
          onSelect={handleAddressSelect}
          onClose={onAddressClose}
        />
      </Drawer>
    </>
  );
};

export default FormAddress;
