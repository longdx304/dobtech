'use client';
import { FC } from 'react';
import Image from 'next/image';
import { Flex, Drawer, Menu } from 'antd';
import type { MenuProps } from 'antd';

import Button from '@/components/Button';
import { menuItems } from './MenuItem';
import { useMemo } from 'react';

interface Props {
	state: boolean;
	onOpen: () => void;
	onClose: () => void;
}
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const DrawerMenu = ({ state, onOpen, onClose }: Props) => {
	
	// Render items menu
	const _menuItems = useMemo(() => menuItems, []);

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
				onClick={() => {}}
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
