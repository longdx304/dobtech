'use client';
import { Button } from '@/components/Button';
import { Dropdown, MenuProps } from 'antd';
import { User, User2 } from 'lucide-react';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://www.antgroup.com'
      >
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://www.aliyun.com'
      >
        2nd menu item (disabled)
      </a>
    ),
    icon: <User2 />,
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://www.luohanacademy.com'
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];

const menu = { items };

const UserInformation = () => {
  return (
    <Dropdown menu={menu}>
      <Button
        icon={<User className='stroke-2' color='#767676' />}
        shape='circle'
        type='text'
        className=''
      />
    </Dropdown>
  );
};

export default UserInformation;
