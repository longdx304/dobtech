import { EPermissions } from './account';

export enum ERoutes {
	LOGIN = '/login',
	HOME = '/',
	ACCOUNTS = '/accounts',
	PRODUCTS = '/products',
	DASHBOARD = '/dashboard',
	PRODUCT_CATEGORIES = '/product-categories',
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
