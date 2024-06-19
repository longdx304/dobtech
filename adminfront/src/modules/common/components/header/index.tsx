'use client';
import { Skeleton, Badge } from 'antd';
import { Menu, Bell } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';
import { User } from '@medusajs/medusa';
import Link from 'next/link';

import { Button, FloatButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import useToggleState from '@/lib/hooks/use-toggle-state';
import useScrollDirection from '@/lib/hooks/useScrollDirection';
import { useUser } from '@/lib/providers/user-provider';
import { cn } from '@/lib/utils';
import { ERoutes } from '@/types/routes';
import DrawerMenu from './DrawerMenu';
import Menubar from './Menubar';
import { Dropdown } from '@/components/Dropdown';
import DropdownRender from '../notification/Dropdown';

interface Props {}

const Header: FC<Props> = ({}) => {
	const { state, onClose, onOpen } = useToggleState(false);
	const scrollDirection = useScrollDirection();
	const { user, isLoading, remove } = useUser();

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
					<Flex>
						<Dropdown
							dropdownRender={(menu) => DropdownRender()}
							trigger={['click']}
							overlayStyle={{
								backgroundColor: 'transparent',
								width: '300px',
								height: 'calc(100% - 60px)',
							}}
							arrow={{ pointAtCenter: true }}
							className="block sm:hidden"
						>
							<a onClick={(e) => e.preventDefault()} className="">
								<Button type="text" shape="circle">
									<Badge dot>
										<Bell color="black" size={20} />
									</Badge>
								</Button>
							</a>
						</Dropdown>
						<Button
							icon={<Menu />}
							shape="circle"
							type="text"
							onClick={() => onOpen()}
							className="sm:hidden"
						/>
					</Flex>
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
