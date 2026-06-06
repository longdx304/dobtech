import type { MenuProps } from 'antd';
import { Flex } from 'antd';
import {
	BadgeDollarSign,
	Boxes,
	Building,
	CircleDollarSign,
	CircleUser,
	Container,
	Earth,
	Ellipsis,
	Layers,
	LayoutList,
	Lock,
	LogOut,
	NotebookPen,
	Package,
	PackageCheck,
	PackageMinus,
	PackagePlus,
	Settings,
	ShoppingCart,
	SquarePercent,
	Truck,
	Undo2,
	User as UserIcon,
	Users,
	UsersRound,
	Warehouse,
} from 'lucide-react';

import { Dropdown } from '@/components/Dropdown';
import {
	AccessPermission,
	pagePermissionDefinitions,
	resolvePagePermissions,
} from '@/lib/access-control';
import { IAdminResponse } from '@/types/account';
import { ERoutes } from '@/types/routes';
import { User } from '@medusajs/medusa';

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
		key: 'profile',
		label: 'Thông tin tài khoản',
		icon: <CircleUser />,
	},
	{
		key: 'change-password',
		label: 'Đổi mật khẩu',
		icon: <Lock />,
	},
	{
		key: 'logout',
		label: 'Đăng xuất',
		icon: <LogOut />,
	},
];

// Item menu overview
const itemSales: Array<[AccessPermission, MenuItem]> = [
	[AccessPermission.SalesOrders, getItem('Đơn hàng', 'orders', <ShoppingCart />)],
	[AccessPermission.SalesCategories, getItem('Danh mục', 'product-categories', <LayoutList />)],
	[AccessPermission.SalesProducts, getItem('Sản phẩm', 'products', <Layers />)],
	[AccessPermission.SalesPricing, getItem('Định giá', 'pricing', <CircleDollarSign />)],
	[AccessPermission.SalesCustomers, getItem('Khách hàng', 'customers', <UsersRound />)],
	[AccessPermission.SalesDiscounts, getItem('Giảm giá', 'discounts', <SquarePercent />)],
	[AccessPermission.SalesGiftCards, getItem('Thẻ quà tặng', 'gift-cards', <Package />)],
];

const itemPurchases: Array<[AccessPermission, MenuItem]> = [
	[AccessPermission.PurchasesSuppliers, getItem('Nhà cung cấp', 'suppliers', <Building />)],
	[AccessPermission.PurchasesOrders, getItem('Nhập hàng', 'supplier-orders', <Container />)],
];

// Item menu warehouse
const itemsWarehouse: Array<[AccessPermission, MenuItem]> = [
	[AccessPermission.WarehouseManage, getItem('Quản lý kho', 'warehouse-manage', <Warehouse />)],
	[AccessPermission.WarehouseInventoryChecker, getItem('Kiểm kho', 'warehouse-inventory-checker', <Package />)],
	[AccessPermission.WarehouseInbound, getItem('Nhập kho', 'warehouse-inbound', <PackagePlus />)],
	[AccessPermission.WarehouseOutbound, getItem('Xuất kho', 'warehouse-outbound', <PackageMinus />)],
	[AccessPermission.WarehouseStockChecker, getItem('Kiểm hàng', 'warehouse-stock-checker', <PackageCheck />)],
	[AccessPermission.WarehouseShipment, getItem('Vận chuyển', 'warehouse-ship', <Truck />)],
	[AccessPermission.WarehouseTransactions, getItem('Sổ kho', 'warehouse-transaction', <NotebookPen />)],
];

// Item menu option
const itemSettings: Array<[AccessPermission, MenuItem]> = [
	[AccessPermission.SettingsRegions, getItem('Khu vực', 'regions', <Earth />)],
	[AccessPermission.SettingsItemUnits, getItem('Đơn vị hàng', 'item-unit', <Boxes />)],
	[AccessPermission.SettingsCurrencies, getItem('Tiền tệ', 'currencies', <BadgeDollarSign />)],
	[AccessPermission.SettingsReturnReasons, getItem('Lý do trả hàng', 'return-reasons', <Undo2 />)],
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
	handleDropdownClick: (e: any) => void,
	pagePermissions?: AccessPermission[]
) => {
	const role = user?.role;
	const permissions =
		role === 'admin'
			? pagePermissionDefinitions.map(({ permission }) => permission)
			: pagePermissions ?? resolvePagePermissions(user as any);
	const allowed = new Set(permissions);
	const filterAllowed = (items: Array<[AccessPermission, MenuItem]>) =>
		items.filter(([permission]) => allowed.has(permission)).map(([, item]) => item);
	const sales = filterAllowed(itemSales);
	const purchases = filterAllowed(itemPurchases);
	const warehouse = filterAllowed(itemsWarehouse);
	const settings = filterAllowed(itemSettings);
	const adminItems = [
		allowed.has(AccessPermission.AccountsManage) &&
			getItem('Quản lý nhân viên', 'accounts', <Users />),
		settings.length > 0 && getItem('Cài đặt', 'setting', <Settings />, settings),
	].filter(Boolean) as MenuItem[];

	return [
		sales.length > 0 && getItem('Bán hàng', 'sale', null, sales, 'group'),
		purchases.length > 0 && getItem('Mua hàng', 'purchase', null, purchases, 'group'),
		warehouse.length > 0 && getItem('Kho', 'inventory', null, warehouse, 'group'),
		adminItems.length > 0 && getItem('Admin', 'admin', null, adminItems, 'group'),
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
	'gift-cards': ERoutes.GIFT_CARDS,
	suppliers: ERoutes.SUPPLIERS,
	'supplier-orders': ERoutes.SUPPLIER_ORDERS,
	currencies: ERoutes.CURRENCIES,
	'warehouse-inbound': ERoutes.WAREHOUSE_INBOUND,
	'warehouse-outbound': ERoutes.WAREHOUSE_OUTBOUND,
	'warehouse-transaction': ERoutes.WAREHOUSE_TRANSACTIONS,
	'item-unit': ERoutes.ITEM_UNIT,
	'warehouse-stock-checker': ERoutes.WAREHOUSE_STOCK_CHECKER,
	'warehouse-ship': ERoutes.WAREHOUSE_SHIPMENT,
	'warehouse-manage': ERoutes.WAREHOUSE_MANAGE,
	'warehouse-inventory-checker': ERoutes.WAREHOUSE_INVENTORY_CHECKER,
};
