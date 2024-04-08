'use client';
import { FC } from 'react';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { Flex, Drawer } from 'antd';

import Card from '@/components/Card';
import Button from '@/components/Button';
import useToggleState from '@/lib/hooks/use-toggle-state';
import DrawerMenu from './DrawerMenu';

interface Props {}

const Header = (): FC<Props> => {
	const { state, onClose, onOpen } = useToggleState(false);

	return (
		<Card className="!fixed !top-0 w-full [&_.ant-card-body]:!py-1">
			<Flex
				className="flex justify-between items-center"
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
				<Button
					icon={<Menu />}
					shape="circle"
					type="text"
					onClick={() => onOpen()}
				/>
			</Flex>
			<DrawerMenu state={state} onOpen={onOpen} onClose={onClose} />
		</Card>
	);
};

export default Header;
