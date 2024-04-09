'use client';
import { FC } from 'react';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { Flex, Drawer } from 'antd';

import Card from '@/components/Card';
import Button from '@/components/Button';
import useToggleState from '@/lib/hooks/use-toggle-state';
import useScrollDirection from '@/lib/hooks/useScrollDirection';
import DrawerMenu from './DrawerMenu';
import { IAdminResponse } from '@/types/account';
import { cn } from '@/lib/utils';
import Menubar from './Menubar';

interface Props {
	user: IAdminResponse;
}

const Header = ({ user }): FC<Props> => {
	const { state, onClose, onOpen } = useToggleState(false);
	const scrollDirection = useScrollDirection();

	return (
		<Card
			className={cn(
				'fixed top-0 w-full p-0 [&_.ant-card-body]:py-2 transition-all ease-in-out duration-300',
				'sm:w-[200px] md:w-[250px] sm:h-full sm:[&_.ant-card-body]:px-0',
				scrollDirection === "up" ? 'max-sm:translate-y-0' : 'max-sm:-translate-y-14'
			)}
			bordered={false}
		>
			{/* Logo */}
			<Flex
				className="sm:justify-center"
				justify="space-between"
				align="center"
			>
				<div className="flex items-center">
					<Image
						src="/images/dob-icon.png"
						width={28}
						height={37}
						alt="Dob Icon"
					/>
				</div>
				{/* Mobile: Button Menu */}
				<Button
					icon={<Menu />}
					shape="circle"
					type="text"
					onClick={() => onOpen()}
					className="sm:hidden"
				/>
			</Flex>
			{/* Desktop: Content Menu */}
			<Menubar user={user} className="hidden sm:block" />
			{/* Mobile: Drawer menu */}
			<DrawerMenu state={state} onOpen={onOpen} onClose={onClose} user={user} />
		</Card>
	);
};

export default Header;
