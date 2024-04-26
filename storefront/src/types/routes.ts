// import { EPermissions } from './account';

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
		mode: [],
	},
	{
		path: ERoutes.PRODUCTS,
		mode: [],
	},
];
