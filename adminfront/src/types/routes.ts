import { EPermissions } from './account';

export enum ERoutes {
	HOME = '/',
	ACCOUNTS = '/accounts',
	PRODUCTS = '/products',
	PRODUCT_CATEGORIES = '/product-categories',
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
		path: ERoutes.PRODUCT_CATEGORIES,
		mode: [],
	},
];
