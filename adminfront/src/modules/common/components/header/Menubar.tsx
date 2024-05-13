import type { MenuProps } from 'antd';
import { Menu, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { ERoutes } from '@/types/routes';
import { User } from '@medusajs/medusa';
import { useAdminDeleteSession } from 'medusa-react';
import { menuItems, menuRoutes } from './MenuItem';

interface Props {
	user: Omit<User, 'password_hash'>;
	className?: string;
	remove: () => void;
}

const Menubar = ({ user, remove, className }: Props) => {
	const router = useRouter();
	const [messageApi, contextHolder] = message.useMessage();
	const { mutate } = useAdminDeleteSession();

	// Handle user click menu items
	const handleClickMenu: MenuProps['onClick'] = (e) => {
		const { key } = e;
		if (menuRoutes[key]) {
			router.push(menuRoutes[key]);
			return;
		}
	};

	const logOut = () => {
		mutate(undefined, {
			onSuccess: () => {
				remove();
				router.push(ERoutes.HOME);
			},
			onError: (err) => {
				message.error('Đăng xuất thất bại!');
			},
		});
	};

	// Handle user click dropdown
	const handleDropdownClick = (e: any) => {
		const { key } = e;
		if (key === 'logout') {
			logOut();
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
