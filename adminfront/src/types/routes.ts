import { EPermissions } from './account';

export enum ERoutes {
	LOGIN = '/login',
	HOME = '/admin',
	ACCOUNTS = '/admin/accounts',
	PRODUCTS = '/admin/products',
	DASHBOARD = '/admin/dashboard',
	PRODUCT_CATEGORIES = '/admin/product-categories',
}

export interface TRouteConfig {
	path: ERoutes;
	mode: EPermissions[];
}

export const routesConfig: TRouteConfig[] = [
	{
		path: ERoutes.LOGIN,
		mode: [],
	},
	{
		path: ERoutes.ACCOUNTS,
		mode: [EPermissions.WarehouseManager],
	},
	{
		path: ERoutes.PRODUCTS,
		mode: [
			EPermissions.WarehouseManager,
			EPermissions.InventoryChecker,
			EPermissions.Driver,
			EPermissions.AssistantDriver,
			EPermissions.WarehouseStaff,
		],
	},
	{
		path: ERoutes.DASHBOARD,
		mode: [
			EPermissions.WarehouseManager,
			EPermissions.InventoryChecker,
			EPermissions.Driver,
			EPermissions.AssistantDriver,
			EPermissions.WarehouseStaff,
		],
	},
	{
		path: ERoutes.PRODUCT_CATEGORIES,
		mode: [EPermissions.WarehouseManager],
	},
];
