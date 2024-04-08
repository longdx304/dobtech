import type { MenuProps } from 'antd';
import { Menu, Flex } from 'antd';
import { CalendarRange, Settings, User, Ellipsis, Users } from 'lucide-react';

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

const itemOverview: MenuProps['items'] = [
	getItem('Quản lý nhân viên', 'overview-1', <Users />),
	getItem('Đơn hàng của bạn', 'overview-2', <CalendarRange />),
	getItem('Label', 'overview-3', <Settings />, [
		getItem('Option 5', '5'),
		getItem('Option 6', '6'),
		getItem('Option 7', '7'),
		getItem('Option 8', '8'),
	]),
];

const itemOption: MenuProps['items'] = [
	getItem('Label', 'option-1', <Settings />),
	getItem('Label', 'option-2', <Settings />),
	getItem('Label', 'option-3', <Settings />),
];

const itemUser: MenuProps['items'] = [
	getItem(
		<Flex className="w-full h-[60px]" justify="space-between" align="center">
			<div>Username </div>
			<Ellipsis />
		</Flex>,
		'user-1',
		<User />
	),
];

export const menuItems: MenuProps['items'] = [
	getItem('Tổng quan', 'overview', null, itemOverview, 'group'),
	getItem('Tuỳ chỉnh', 'option', null, itemOption, 'group'),
	getItem('', 'user', null, itemUser, 'group'),
];

export const menuRoutes: Record<string, string> = {
	'overview-1': '/accounts',
};
