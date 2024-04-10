import { Menu } from 'antd';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/actions/accounts';
import { IAdminResponse } from '@/types/account';
import type { MenuProps } from 'antd';

import { menuItems, menuRoutes } from './MenuItem';

interface Props {
	user: IAdminResponse;
	className?: string;
}

const Menubar = ({ user, className }: Props) => {
	const router = useRouter();

	// Handle user click menu items
	const handleClickMenu: MenuProps['onClick'] = (e) => {
		const { key } = e;
		if (menuRoutes[key]) {
			router.push(menuRoutes[key]);
			return;
		}
	};

	// Handle user click dropdown
	const handleDropdownClick = (e: any) => {
		const { key } = e;
		if (key === 'logout') {
			signOut();
		}
	};

	// Render items menu
	const _menuItems = useMemo(
		() => menuItems(user, handleDropdownClick),
		[user]
	);

	return (
		<Menu
			className={className}
			onClick={handleClickMenu}
			mode="inline"
			items={_menuItems}
		/>
	);
};

export default Menubar;
