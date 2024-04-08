'use client';
import { FC, MouseEvent } from 'react';
import Image from 'next/image';
import { Flex, Drawer, Menu } from 'antd';
import type { MenuProps } from 'antd';

import Button from '@/components/Button';
import { menuItems, menuRoutes } from './MenuItem';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IAdminResponse } from '@/types/account';
import { signOut } from '@/actions/accounts';

interface Props {
	state: boolean;
	onOpen: () => void;
	onClose: () => void;
	user: IAdminResponse;
}

const DrawerMenu = ({ state, onOpen, onClose, user }: Props) => {
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
	const handleDropdownClick = (e) => {
		const { key } = e;
		if (key === 'logout') {
			console.log("logout")
			signOut();
		}
	};

	// Render items menu
	const _menuItems = useMemo(
		() => menuItems(user, handleDropdownClick),
		[user]
	);

	return (
		<Drawer
			className="[&_.ant-drawer-title]:flex [&_.ant-drawer-title]:justify-center [&_.ant-drawer-title]:items-center [&_.ant-drawer-body]:!px-0"
			width={220}
			title={
				<Image
					src="/images/dob-icon.png"
					width={33}
					height={48}
					alt="Dob Icon"
				/>
			}
			closeIcon={null}
			onClose={() => onClose()}
			open={state}
		>
			<Menu
				className=""
				onClick={handleClickMenu}
				// style={{ width: 256 }}
				// defaultSelectedKeys={['1']}
				// defaultOpenKeys={['sub1']}
				mode="inline"
				items={_menuItems}
			/>
		</Drawer>
	);
};

export default DrawerMenu;
