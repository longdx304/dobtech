import type { MenuProps } from 'antd';
import { Flex } from 'antd';
import {
	CalendarRange,
	ClipboardPenLine,
	Ellipsis,
	LogOut,
	Settings,
	User as UserIcon,
	Users,
	LayoutList,
	CircleDollarSign,
} from 'lucide-react';

import { Dropdown } from '@/components/Dropdown';
import { IAdminResponse } from '@/types/account';
import { User } from '@medusajs/medusa';
import { ERoutes } from '@/types/routes';

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
const itemOverview = (role: string, permissions: string[]) =>
	[
		role === 'admin' && getItem('Quản lý nhân viên', 'overview-1', <Users />),
		role === 'admin' && getItem('Danh mục', 'overview-2', <LayoutList />),
		role === 'admin' && getItem('Định giá', 'pricing', <CircleDollarSign />),
		getItem('Quản lý sản phẩm', 'overview-3', <ClipboardPenLine />),
		getItem('Đơn hàng của bạn', 'overview-4', <CalendarRange />),
		getItem('Label', 'overview-5', <Settings />, [
			getItem('Option 6', '6'),
			getItem('Option 7', '7'),
			getItem('Option 8', '8'),
			getItem('Option 9', '9'),
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
		<UserIcon />
	),
];

// Generation menu
export const menuItems = (
	user: Omit<User, 'password_hash'>,
	handleDropdownClick: (e: any) => void
) => {
	const role = user?.role;
	const permissions = (user as any)?.permissions?.split(',');
	return [
		getItem(
			'Tổng quan',
			'overview',
			null,
			itemOverview(role, permissions) as MenuItem[],
			'group'
		),
		getItem('Tuỳ chỉnh', 'option', null, itemOption, 'group'),
		getItem(
			'',
			'user',
			null,
			itemUser(user as any, handleDropdownClick),
			'group'
		),
	];
};

export const menuRoutes: Record<string, string> = {
	'overview-1': ERoutes.ACCOUNTS,
	'overview-2': ERoutes.PRODUCT_CATEGORIES,
	'overview-3': ERoutes.PRODUCTS,
	pricing: ERoutes.PRICING,
};
