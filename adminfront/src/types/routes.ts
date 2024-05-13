import { EPermissions } from './account';

export enum ERoutes {
	HOME = '/',
	ACCOUNTS = '/accounts',
	PRODUCTS = '/products',
	DASHBOARD = '/dashboard',
}

export interface TRouteConfig {
	path: ERoutes;
	mode: EPermissions[];
}

export const routesConfig: TRouteConfig[] = [
	{
		path: ERoutes.ACCOUNTS,
		mode: [EPermissions.WarehouseManager],
	},
	{
		path: ERoutes.PRODUCTS,
		mode: [EPermissions.WarehouseManager, EPermissions.InventoryChecker],
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
];
