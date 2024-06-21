import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { ERoutes } from '@/types/routes';
import { signOut } from '../../actions';
import { menuItems, menuRoutes } from './MenuItem';

interface Props {
  className?: string;
}

const Menubar = ({ className }: Props) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push(ERoutes.DASHBOARD);
  };

  // Handle user click menu items
  const handleClickMenu: MenuProps['onClick'] = (e) => {
    const { key } = e;

    if (key === 'logout') {
      handleLogout();
      return;
    }

    if (menuRoutes[key]) {
      router.push(menuRoutes[key]);
      return;
    }
  };

  // Render items menu
  const _menuItems = useMemo(
    () => menuItems(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Menu
      className={cn(
        ' [&_.ant-menu-item-selected]:bg-white [&_.ant-menu-sub]:bg-white',
        className
      )}
      onClick={handleClickMenu}
      mode='inline'
      items={_menuItems}
      style={{ borderInlineEnd: 'none' }}
      defaultOpenKeys={['overview-2']}
    />
  );
};

export default Menubar;
