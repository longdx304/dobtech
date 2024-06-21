import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Modal } from '@/components/Modal';
import { Text } from '@/components/Typography';
import { List } from 'antd';
import { useState } from 'react';
import EditEmail from '../profile-email/EditEmail';
import ProfileName from '../profile-name';
import ProfilePassword from '../profile-password';
import EditPhone from '../profile-phone/EditPhone';

type Props = {
  data: any[];
};

const UserSecurityDesktop = ({ data }: Props) => {
  const [visibleModal, setVisibleModal] = useState<string | null>(null);

  const showModal = (modalType: string) => {
    setVisibleModal(modalType);
  };

  const handleCancel = () => {
    setVisibleModal(null);
  };

  return (
    <Flex className='flex-col'>
      <Text className='flex w-full justify-center text-[28px] font-bold p-2'>
        Quản lý tài khoản
      </Text>

      <List
        itemLayout='horizontal'
        dataSource={data}
        className='px-4 mt-0'
        renderItem={(item) => (
          <List.Item
            style={{
              borderBlockEnd: '1px solid rgba(5, 5, 5, 0.06)',
            }}
            className='py-4'
          >
            <Flex className='w-full' align='center'>
              <Flex className='w-full flex-col'>
                <Text className='text-base font-bold'>{item.title}</Text>
                <Flex align='center' gap={4} className='pt-2'>
                  <Text className='text-sm text-[#767676]'>{item.value}</Text>
                </Flex>
              </Flex>

              <Button type='default' onClick={() => showModal(item.modalType)}>
                Thay đổi
              </Button>
            </Flex>
          </List.Item>
        )}
      />

      {/* Modal Email */}
      <Modal
        open={visibleModal === 'email'}
        onCancel={handleCancel}
        footer={null}
        className='[&_.ant-modal-body]:pt-5'
      >
        <EditEmail onClose={handleCancel} />
      </Modal>

      {/* Modal Name */}
      <Modal
        open={visibleModal === 'name'}
        onCancel={handleCancel}
        footer={null}
        className='[&_.ant-modal-body]:pt-5'
      >
        <ProfileName onClose={handleCancel} />
      </Modal>

      {/* Modal Phone */}
      <Modal
        open={visibleModal === 'phone'}
        onCancel={handleCancel}
        footer={null}
        className='[&_.ant-modal-body]:pt-5'
      >
        <EditPhone onClose={handleCancel} />
      </Modal>

      {/* Modal Password */}
      <Modal
        open={visibleModal === 'password'}
        onCancel={handleCancel}
        footer={null}
        className='[&_.ant-modal-body]:pt-5'
      >
        <ProfilePassword onClose={handleCancel} />
      </Modal>
    </Flex>
  );
};

export default UserSecurityDesktop;
