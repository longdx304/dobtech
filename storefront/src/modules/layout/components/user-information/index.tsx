'use client';
import { Button } from '@/components/Button';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { signOut } from '@/modules/user/actions';
import { ERoutes } from '@/types/routes';
import { Dropdown, MenuProps } from 'antd';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserInformation = () => {
  const { customer } = useCustomer();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push(ERoutes.DASHBOARD);
  };

  const items: MenuProps['items'] = customer
    ? [
        {
          key: '1',
          label: (
            <span>
              {customer.first_name} {customer.last_name}
            </span>
          ),
          icon: <User />,
        },
        {
          key: '2',
          label: (
            <a rel='noopener noreferrer' href='/orders'>
              Đơn hàng của tôi
            </a>
          ),
        },
        {
          key: '4',
          danger: true,
          label: <span onClick={handleLogout}>Đăng xuất</span>,
        },
      ]
    : [
        {
          key: '1',
          label: (
            <a rel='noopener noreferrer' href='/user/auth'>
              Đăng nhập / đăng kí
            </a>
          ),
          icon: <User />,
        },
      ];

  const menu = { items };

  return (
    <Dropdown menu={menu}>
      <Button
        icon={<User className='stroke-2' color='#767676' />}
        shape='circle'
        type='text'
      />
    </Dropdown>
  );
};

export default UserInformation;
