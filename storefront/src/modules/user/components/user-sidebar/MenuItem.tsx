import type { MenuProps } from 'antd';
import { FolderKanban, LandPlot, ListTodo } from 'lucide-react';

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

// Item menu overview
const itemOverview = () =>
	[
		getItem(
			<span className="text-lg font-bold">Trung Tâm cá nhân</span>,
			'overview-1'
		),
		getItem(
			<span className="text-base font-bold">Tài khoản của tôi</span>,
			'overview-2',
			null,
			[
				getItem('Quản lý tài khoản của tôi', 'overview-2-1', <FolderKanban />),
				getItem(
					<span data-testid="addresses-link">Sổ địa chỉ</span>,
					'overview-2-2',
					<LandPlot />
				),
				getItem('Đơn hàng của tôi', 'overview-2-3', <ListTodo />),
			]
		),
		getItem(
			<span className="text-base font-bold" data-testid="logout-button">
				Đăng xuất
			</span>,
			'logout'
		),
	].filter(() => true);

// Generation menu
export const menuItems = () => {
	return [getItem('', 'overview', null, itemOverview() as MenuItem[], 'group')];
};

export const menuRoutes: Record<string, string> = {
	'overview-1': `/${ERoutes.USER}`,
	'overview-2-1': `/${ERoutes.USER_SETTING_SECURITY}`,
	'overview-2-2': `/${ERoutes.USER_ADDRESSBOOK}`,
	'overview-2-3': `/${ERoutes.USER_ORDERS}`,
};
