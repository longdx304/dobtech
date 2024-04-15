import type { MenuProps } from 'antd';
import { Menu, Flex } from 'antd';
import {
	CalendarRange,
	Settings,
	User,
	Ellipsis,
	Users,
	LogOut,
} from 'lucide-react';

import { IAdminResponse } from '@/types/account.ts';
import { Text } from '@/components/Typography';
import { Dropdown } from '@/components/Dropdown';

type MenuItem = Required<MenuProps>['items'][number];
function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: 'group'
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

// Item dropdown user
const itemDropdown: MenuProps['items'] = [
	{
		label: 'Đăng xuất',
		key: 'logout',
		icon: <LogOut />,
	},
];

// Item menu overview
const itemOverview: MenuProps['items'] = (
	role: string,
	permissions: string[]
) =>
	[
		role === 'admin' && getItem('Quản lý nhân viên', 'overview-1', <Users />),
		getItem('Đơn hàng của bạn', 'overview-2', <CalendarRange />),
		getItem('Label', 'overview-3', <Settings />, [
			getItem('Option 5', '5'),
			getItem('Option 6', '6'),
			getItem('Option 7', '7'),
			getItem('Option 8', '8'),
		]),
	].filter(() => true);

// Item menu option
const itemOption: MenuProps['items'] = [
	getItem('Label', 'option-1', <Settings />),
	getItem('Label', 'option-2', <Settings />),
	getItem('Label', 'option-3', <Settings />),
];

// Item menu user
const itemUser = (
	user: IAdminResponse,
	handleDropdownClick: (e: any) => void
) => [
	getItem(
		<Dropdown
			menu={{ items: itemDropdown, onClick: handleDropdownClick }}
			trigger={['click']}
		>
			<a onClick={(e) => e.preventDefault()}>
				<Flex className="w-full" justify="space-between" align="center">
					<div className="font-bold">
						{`${user?.first_name ?? ''} ${user?.last_name ?? ''}`}
					</div>
					<Ellipsis />
				</Flex>
			</a>
		</Dropdown>,
		'user-1',
		<User />
	),
];

// Generation menu
export const menuItems = (
	user: IAdminResponse,
	handleDropdownClick: (e: any) => void
) => {
	const role = user.role;
	const permissions = user.permissions.split(',');
	return [
		getItem(
			'Tổng quan',
			'overview',
			null,
			itemOverview(role, permissions),
			'group'
		),
		getItem('Tuỳ chỉnh', 'option', null, itemOption, 'group'),
		getItem('', 'user', null, itemUser(user, handleDropdownClick), 'group'),
	];
};

export const menuRoutes: Record<string, string> = {
	'overview-1': '/accounts',
};
