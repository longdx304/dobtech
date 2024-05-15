'use client';
import { Skeleton } from 'antd';
import { Menu } from 'lucide-react';
import { useAdminGetSession } from 'medusa-react';
import Image from 'next/image';
import { FC } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import useToggleState from '@/lib/hooks/use-toggle-state';
import useScrollDirection from '@/lib/hooks/useScrollDirection';
import { cn } from '@/lib/utils';
import { ERoutes } from '@/types/routes';
import { User } from '@medusajs/medusa';
import Link from 'next/link';
import DrawerMenu from './DrawerMenu';
import Menubar from './Menubar';

interface Props {}

const Header: FC<Props> = ({}) => {
	const { state, onClose, onOpen } = useToggleState(false);
	const scrollDirection = useScrollDirection();
	const { user, isLoading, remove } = useAdminGetSession();
	return (
		<Card
			className={cn(
				'fixed top-0 w-full p-0 [&_.ant-card-body]:py-2 transition-all ease-in-out duration-300 z-[999]',
				'sm:w-[200px] md:w-[250px] sm:h-full sm:[&_.ant-card-body]:px-0',
				scrollDirection === 'up'
					? 'max-sm:translate-y-0'
					: 'max-sm:-translate-y-14'
			)}
			bordered={false}
		>
			<Skeleton loading={isLoading} className="px-4 pt-4" active>
				<Flex
					className="sm:justify-center"
					justify="space-between"
					align="center"
				>
					<Link href={ERoutes.DASHBOARD} className="flex items-center">
						<Image
							src="/images/dob-icon.png"
							width={28}
							height={37}
							alt="Dob Icon"
						/>
					</Link>
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
				<Menubar
					user={user as Omit<User, 'password_hash'>}
					remove={remove}
					className="hidden sm:block"
				/>
				{/* Mobile: Drawer menu */}
				<DrawerMenu
					state={state}
					onOpen={onOpen}
					onClose={onClose}
					user={user as Omit<User, 'password_hash'>}
				/>
			</Skeleton>
		</Card>
	);
};

export default Header;
