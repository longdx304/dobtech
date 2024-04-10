'use client';
import { FC, MouseEvent } from 'react';
import Image from 'next/image';
import { Flex, Drawer, Menu } from 'antd';

import { Button } from '@/components/Button';
import { IAdminResponse } from '@/types/account';
import Menubar from './Menubar';

interface Props {
	state: boolean;
	onOpen: () => void;
	onClose: () => void;
	user: IAdminResponse;
}

const DrawerMenu = ({ state, onOpen, onClose, user }: Props) => {
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
			<Menubar user={user} />
		</Drawer>
	);
};

export default DrawerMenu;
