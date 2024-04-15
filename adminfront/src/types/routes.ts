import { EPermissions } from './account';

export enum ERoutes {
	HOME = '/',
	ACCOUNTS = '/accounts',
	PRODUCTS = '/products',
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
];
