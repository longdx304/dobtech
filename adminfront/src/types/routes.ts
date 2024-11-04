import { EPermissions } from './account';

export enum ERoutes {
	LOGIN = '/login',
	HOME = '/admin',
	ACCOUNTS = '/admin/accounts',
	PRODUCTS = '/admin/products',
	DASHBOARD = '/admin/dashboard',
	PRODUCT_CATEGORIES = '/admin/product-categories',
	PRICING = '/admin/pricing',
	CUSTOMERS = '/admin/customers',
	REGIONS = '/admin/regions',
	ORDERS = '/admin/orders',
	RETURN_REASONS = '/admin/return-reasons',
	DISCOUNTS = '/admin/discounts',
	SUPPLIERS = '/admin/suppliers',
	GIFT_CARDS = '/admin/gift-cards',
	CURRENCIES = '/admin/currencies',
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
	{
		path: ERoutes.PRICING,
		mode: [],
	},
	{
		path: ERoutes.CUSTOMERS,
		mode: [],
	},
	{
		path: ERoutes.REGIONS,
		mode: [],
	},
	{
		path: ERoutes.ORDERS,
		mode: [],
	},
	{
		path: ERoutes.RETURN_REASONS,
		mode: [],
	},
	{
		path: ERoutes.DISCOUNTS,
		mode: [],
	},
	{
		path: ERoutes.GIFT_CARDS,
		mode: [],
	},
	{
		path: ERoutes.SUPPLIERS,
		mode: [],
	},
	{
		path: ERoutes.CURRENCIES,
		mode: [],
	},
];
