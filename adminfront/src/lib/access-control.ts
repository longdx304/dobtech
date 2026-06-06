import { EPermissions } from '@/types/account';

export const ADMIN_ACCESS_PROFILE_REFRESH_EVENT = 'admin-access-profile-refresh';

export enum AccessPermission {
	DashboardView = 'dashboard.view',
	AccountsManage = 'accounts.manage',
	SalesOrders = 'sales.orders',
	SalesProducts = 'sales.products',
	SalesCategories = 'sales.categories',
	SalesPricing = 'sales.pricing',
	SalesCustomers = 'sales.customers',
	SalesDiscounts = 'sales.discounts',
	SalesGiftCards = 'sales.gift_cards',
	PurchasesSuppliers = 'purchases.suppliers',
	PurchasesOrders = 'purchases.orders',
	WarehouseManage = 'warehouse.manage',
	WarehouseInventoryChecker = 'warehouse.inventory_checker',
	WarehouseInbound = 'warehouse.inbound',
	WarehouseOutbound = 'warehouse.outbound',
	WarehouseStockChecker = 'warehouse.stock_checker',
	WarehouseShipment = 'warehouse.shipment',
	WarehouseTransactions = 'warehouse.transactions',
	SettingsRegions = 'settings.regions',
	SettingsItemUnits = 'settings.item_units',
	SettingsCurrencies = 'settings.currencies',
	SettingsReturnReasons = 'settings.return_reasons',
}

export interface AccessControlMetadata {
	access_control?: {
		page_permissions?: string[];
		[key: string]: unknown;
	};
	[key: string]: unknown;
}

export interface AccessControlledUser {
	role?: string | null;
	permissions?: string | null;
	metadata?: AccessControlMetadata | null;
}

export interface PagePermissionDefinition {
	permission: AccessPermission;
	label: string;
	group: string;
	route: string;
	roles: EPermissions[];
}

const ALL_ROLES = [
	EPermissions.Manager,
	EPermissions.Warehouse,
	EPermissions.Driver,
	EPermissions.Accountant,
];

export const pagePermissionDefinitions: PagePermissionDefinition[] = [
	{ permission: AccessPermission.DashboardView, label: 'Tổng quan', group: 'Tổng quan', route: '/admin', roles: ALL_ROLES },
	{ permission: AccessPermission.AccountsManage, label: 'Quản lý nhân viên', group: 'Admin', route: '/admin/accounts', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.SalesOrders, label: 'Đơn hàng và đơn nháp', group: 'Bán hàng', route: '/admin/orders', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.SalesCategories, label: 'Danh mục', group: 'Bán hàng', route: '/admin/product-categories', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.SalesProducts, label: 'Sản phẩm', group: 'Bán hàng', route: '/admin/products', roles: ALL_ROLES },
	{ permission: AccessPermission.SalesPricing, label: 'Định giá', group: 'Bán hàng', route: '/admin/pricing', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.SalesCustomers, label: 'Khách hàng', group: 'Bán hàng', route: '/admin/customers', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.SalesDiscounts, label: 'Giảm giá', group: 'Bán hàng', route: '/admin/discounts', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.SalesGiftCards, label: 'Thẻ quà tặng', group: 'Bán hàng', route: '/admin/gift-cards', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.PurchasesSuppliers, label: 'Nhà cung cấp', group: 'Mua hàng', route: '/admin/suppliers', roles: [EPermissions.Manager, EPermissions.Accountant] },
	{ permission: AccessPermission.PurchasesOrders, label: 'Nhập hàng và đơn nháp', group: 'Mua hàng', route: '/admin/supplier-orders', roles: [EPermissions.Manager, EPermissions.Accountant] },
	{ permission: AccessPermission.WarehouseManage, label: 'Quản lý kho', group: 'Kho', route: '/admin/warehouse/manage', roles: [EPermissions.Manager, EPermissions.Driver] },
	{ permission: AccessPermission.WarehouseInventoryChecker, label: 'Kiểm kho', group: 'Kho', route: '/admin/warehouse/inventory-checker', roles: [EPermissions.Manager, EPermissions.Driver] },
	{ permission: AccessPermission.WarehouseInbound, label: 'Nhập kho', group: 'Kho', route: '/admin/warehouse/inbound', roles: [EPermissions.Manager, EPermissions.Warehouse] },
	{ permission: AccessPermission.WarehouseOutbound, label: 'Xuất kho', group: 'Kho', route: '/admin/warehouse/outbound', roles: [EPermissions.Manager, EPermissions.Warehouse] },
	{ permission: AccessPermission.WarehouseStockChecker, label: 'Kiểm hàng', group: 'Kho', route: '/admin/warehouse/stock-checker', roles: [EPermissions.Manager, EPermissions.Warehouse] },
	{ permission: AccessPermission.WarehouseShipment, label: 'Vận chuyển', group: 'Kho', route: '/admin/warehouse/shipment', roles: [EPermissions.Manager, EPermissions.Driver] },
	{ permission: AccessPermission.WarehouseTransactions, label: 'Sổ kho', group: 'Kho', route: '/admin/warehouse/transactions', roles: [EPermissions.Manager, EPermissions.Warehouse] },
	{ permission: AccessPermission.SettingsRegions, label: 'Khu vực', group: 'Cài đặt', route: '/admin/regions', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.SettingsItemUnits, label: 'Đơn vị hàng', group: 'Cài đặt', route: '/admin/item-unit', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.SettingsCurrencies, label: 'Tiền tệ', group: 'Cài đặt', route: '/admin/currencies', roles: [EPermissions.Manager] },
	{ permission: AccessPermission.SettingsReturnReasons, label: 'Lý do trả hàng', group: 'Cài đặt', route: '/admin/return-reasons', roles: [EPermissions.Manager] },
];

const validPermissions = new Set(pagePermissionDefinitions.map(({ permission }) => permission));
const routeAliases: Array<[string, AccessPermission]> = [
	['/admin/dashboard', AccessPermission.DashboardView] as [string, AccessPermission],
	['/admin/supplier-draft-orders', AccessPermission.PurchasesOrders] as [string, AccessPermission],
	['/admin/draft-orders', AccessPermission.SalesOrders] as [string, AccessPermission],
	['/admin/gift-cards', AccessPermission.SalesGiftCards] as [string, AccessPermission],
	...pagePermissionDefinitions
		.filter(({ route }) => route !== '/admin')
		.map(({ route, permission }) => [route, permission] as [string, AccessPermission]),
].sort(([left], [right]) => right.length - left.length);

export const pagePermissionGroups = pagePermissionDefinitions.reduce<Record<string, PagePermissionDefinition[]>>(
	(groups, definition) => {
		(groups[definition.group] ??= []).push(definition);
		return groups;
	},
	{}
);

export function getPresetPagePermissions(roles: EPermissions[]): AccessPermission[] {
	const selectedRoles = new Set(roles);
	return pagePermissionDefinitions
		.filter(({ roles: presetRoles }) => presetRoles.some((role) => selectedRoles.has(role)))
		.map(({ permission }) => permission);
}

export function resolvePagePermissions(user: AccessControlledUser): AccessPermission[] {
	const saved = user.metadata?.access_control?.page_permissions;
	if (Array.isArray(saved)) {
		return saved.filter(
			(permission): permission is AccessPermission =>
				validPermissions.has(permission as AccessPermission)
		);
	}

	return getPresetPagePermissions(
		(user.permissions ?? '').split(',').filter(Boolean) as EPermissions[]
	);
}

export function getRequiredPagePermission(pathname: string): AccessPermission | undefined {
	if (pathname === '/admin') {
		return AccessPermission.DashboardView;
	}
	return routeAliases.find(([route]) => pathname === route || pathname.startsWith(`${route}/`))?.[1];
}

export function hasAdminRouteAccess(pathname: string, permissions: AccessPermission[]): boolean {
	const requiredPermission = getRequiredPagePermission(pathname);
	return requiredPermission !== undefined && permissions.includes(requiredPermission);
}

export function getDefaultAdminRoute(permissions: AccessPermission[]): string | null {
	const allowed = new Set(permissions);
	return pagePermissionDefinitions.find(({ permission }) => allowed.has(permission))?.route ?? null;
}

export function mergeAccessControlMetadata(
	metadata: AccessControlMetadata | null | undefined,
	pagePermissions: string[]
): AccessControlMetadata {
	return {
		...(metadata ?? {}),
		access_control: {
			...(metadata?.access_control ?? {}),
			page_permissions: pagePermissions.filter((permission) =>
				validPermissions.has(permission as AccessPermission)
			),
		},
	};
}
