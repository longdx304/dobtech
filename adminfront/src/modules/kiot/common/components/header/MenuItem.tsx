import type { MenuProps } from 'antd';
import { Flex } from 'antd';
import {
	Boxes,
	Ellipsis,
	LogOut,
	NotebookPen,
	Package,
	PackageCheck,
	PackageMinus,
	PackagePlus,
	Settings,
	Truck,
	User as UserIcon,
	Users,
	Warehouse,
} from 'lucide-react';

import { Dropdown } from '@/components/Dropdown';
import { EPermissions, IAdminResponse } from '@/types/account';
import { ERoutes } from '@/types/routes';
import { User } from '@medusajs/medusa';
import intersection from 'lodash/intersection';
import isEmpty from 'lodash/isEmpty';

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
		key: 'logout',
		label: 'Đăng xuất',
		icon: <LogOut />,
	},
];

// Item menu warehouse
const itemsWarehouse: MenuProps['items'] = [
	getItem('Quản lý kho', 'warehouse-manage', <Warehouse />),

	// getItem('Kiểm kho', 'warehouse-inventory-checker', <Package />),
	getItem('Nhập kho', 'warehouse-inbound', <PackagePlus />),
	// getItem('Xuất kho', 'warehouse-outbound', <PackageMinus />),
	// getItem('Kiểm hàng', 'warehouse-stock-checker', <PackageCheck />),
	// getItem('Vận chuyển', 'warehouse-ship', <Truck />),
	getItem('Sổ kho', 'warehouse-transaction', <NotebookPen />),
];

// Item menu option
const itemsAdmin: MenuProps['items'] = [
	getItem('Quản lý nhân viên', 'accounts', <Users />),
	getItem('Cài đặt', 'setting', <Settings />, [
		getItem('Đơn vị hàng', 'item-unit', <Boxes />),
	]),
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
	let permissions = (user as any)?.permissions?.split(',');

	if (role === 'admin') {
		permissions = [
			EPermissions.Manager,
			EPermissions.Warehouse,
			EPermissions.Driver,
			EPermissions.Accountant,
		];
	}

	// Check if user has required permissions for warehouse
	const hasRequiredPermissionsWarehouse = !isEmpty(
		intersection(permissions, [EPermissions.Manager, EPermissions.Warehouse])
	);

	return [
		hasRequiredPermissionsWarehouse &&
			getItem('Kho', 'warehouse', null, itemsWarehouse as MenuItem[], 'group'),
		role === 'admin' &&
			getItem('Admin', 'admin', null, itemsAdmin as MenuItem[], 'group'),
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
	accounts: ERoutes.KIOT_ACCOUNTS,
	'warehouse-inbound': ERoutes.KIOT_WAREHOUSE_INBOUND,
	// 'warehouse-outbound': ERoutes.KIOT_WAREHOUSE_OUTBOUND,
	'warehouse-transaction': ERoutes.KIOT_WAREHOUSE_TRANSACTIONS,
	'item-unit': ERoutes.KIOT_ITEM_UNIT,
	// 'warehouse-stock-checker': ERoutes.KIOT_WAREHOUSE_STOCK_CHECKER,
	'warehouse-manage': ERoutes.KIOT_WAREHOUSE_MANAGE,
	// 'warehouse-inventory-checker': ERoutes.KIOT_WAREHOUSE_INVENTORY_CHECKER,
};
