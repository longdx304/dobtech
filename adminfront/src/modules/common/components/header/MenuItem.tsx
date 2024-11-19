import type { MenuProps } from 'antd';
import { Flex } from 'antd';
import {
	BadgeDollarSign,
	Boxes,
	CalendarRange,
	CircleDollarSign,
	ClipboardPenLine,
	Earth,
	Ellipsis,
	LayoutList,
	LogOut,
	PackageMinus,
	PackagePlus,
	Settings,
	ShoppingCart,
	SquarePercent,
	Undo2,
	User as UserIcon,
	Users,
	UsersRound,
	Warehouse,
} from 'lucide-react';

import { Dropdown } from '@/components/Dropdown';
import { EPermissions, IAdminResponse } from '@/types/account';
import { ERoutes } from '@/types/routes';
import { User } from '@medusajs/medusa';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';

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

// Item menu overview
const itemOverview = (role: string, permissions: string[]) =>
	[
		getItem('Đơn hàng', 'orders', <ShoppingCart />),
		getItem('Sản phẩm', 'products', <ClipboardPenLine />),
		getItem('Đơn hàng của bạn', 'overview-4', <CalendarRange />),
	].filter(() => true);

// Item menu warehouse
const itemsWarehouse: MenuProps['items'] = [
	getItem('Nhập hàng', 'warehouse-inbound', <PackagePlus />),
	getItem('Lấy hàng', 'warehouse-outbound', <PackageMinus />),
];

// Item menu option
const itemsAdmin: MenuProps['items'] = [
	getItem('Quản lý nhân viên', 'accounts', <Users />),
	getItem('Danh mục', 'product-categories', <LayoutList />),
	getItem('Định giá', 'pricing', <CircleDollarSign />),
	getItem('Khách hàng', 'customers', <UsersRound />),
	getItem('Nhà Cung Cấp', 'suppliers', <Warehouse />),
	getItem('Giảm giá', 'discounts', <SquarePercent />),
	getItem('Cài đặt', 'setting', <Settings />, [
		getItem('Khu vực', 'regions', <Earth />),
		getItem('Đơn vị hàng', 'item-unit', <Boxes />),
		getItem('Tiền tệ', 'currencies', <BadgeDollarSign />),
		getItem('Lý do trả hàng', 'return-reasons', <Undo2 />),
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
			EPermissions.WarehouseManager,
			EPermissions.WarehouseStaff,
			EPermissions.Driver,
			EPermissions.InventoryChecker,
			EPermissions.AssistantDriver,
		];
	}

	// Check if user has required permissions for warehouse
	const hasRequiredPermissionsWarehouse = !isEmpty(
		intersection(permissions, [
			EPermissions.WarehouseManager,
			EPermissions.WarehouseStaff,
		])
	);

	return [
		getItem(
			'Tổng quan',
			'overview',
			null,
			itemOverview(role, permissions) as MenuItem[],
			'group'
		),
		hasRequiredPermissionsWarehouse &&
			getItem('Kho', 'inventory', null, itemsWarehouse as MenuItem[], 'group'),
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
	accounts: ERoutes.ACCOUNTS,
	'product-categories': ERoutes.PRODUCT_CATEGORIES,
	products: ERoutes.PRODUCTS,
	pricing: ERoutes.PRICING,
	customers: ERoutes.CUSTOMERS,
	regions: ERoutes.REGIONS,
	orders: ERoutes.ORDERS,
	'return-reasons': ERoutes.RETURN_REASONS,
	discounts: ERoutes.DISCOUNTS,
	suppliers: ERoutes.SUPPLIERS,
	currencies: ERoutes.CURRENCIES,
	'warehouse-inbound': ERoutes.WAREHOUSE_INBOUND,
	'warehouse-outbound': ERoutes.WAREHOUSE_OUTBOUND,
	'item-unit': ERoutes.ITEM_UNIT,
};
