'use client';

import { Button } from '@/components/Button';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { signOut } from '@/modules/user/actions';
import { ERoutes } from '@/types/routes';
import { Dropdown, MenuProps, Spin } from 'antd';
import { Loader2, LogOut, Package, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MenuItemType {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  type?: 'divider';
}

const UserInformation = () => {
  const { customer } = useCustomer();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuLoading, setIsMenuLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push(ERoutes.DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = async (route: string) => {
    try {
      setIsMenuLoading(true);
      await router.push(route);
    } finally {
      setIsMenuLoading(false);
    }
  };

  const handleClickMenu: MenuProps['onClick'] = async (e) => {
    const { key } = e;
    if (key === 'logout') {
      await handleLogout();
      return;
    }
  };

  const items: MenuProps['items'] = customer
    ? [
        {
          key: 'dropdown-1',
          label: (
            <div
              onClick={() => handleNavigation(`/${ERoutes.USER}`)}
              data-testid="nav-account-link"
              className="flex items-center gap-2 min-w-[200px] py-1"
            >
              <span className="flex-1">
                {customer.first_name} {customer.last_name}
              </span>
              {isMenuLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          ),
          icon: <User className="w-4 h-4" />,
        },
        {
          key: 'dropdown-2',
          label: (
            <div
              onClick={() => handleNavigation(`/${ERoutes.USER_ORDERS}`)}
              className="flex items-center gap-2 py-1"
            >
              <span className="flex-1">Đơn hàng của tôi</span>
              {isMenuLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          ),
          icon: <Package className="w-4 h-4" />,
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          danger: true,
          label: (
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 py-1"
            >
              <span className="flex-1 hover:text-white">Đăng xuất</span>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          ),
          icon: <LogOut className="w-4 h-4" />,
        },
      ]
    : [
        {
          key: 'dropdown-1',
          label: (
            <div
              onClick={() => handleNavigation(`/${ERoutes.AUTH}`)}
              data-testid="nav-account-link"
              className="flex items-center gap-2 min-w-[200px] py-1"
            >
              <span className="flex-1">Đăng nhập / đăng kí</span>
              {isMenuLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          ),
          icon: <User className="w-4 h-4" />,
        },
      ];

  const menu = {
    items,
    onClick: handleClickMenu,
  };

  return (
    <Dropdown menu={menu} placement="bottomRight">
      <Button
        icon={
          isLoading ? (
            <Spin size="small" />
          ) : (
            <User
              className="stroke-2"
              color="#767676"
              data-testid="nav-account-dropdown"
            />
          )
        }
        shape="circle"
        type="text"
        aria-label="User Information"
        disabled={isLoading}
      />
    </Dropdown>
  );
};

export default UserInformation;