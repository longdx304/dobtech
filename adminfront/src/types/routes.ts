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
	DRAFT_ORDERS = '/admin/draft-orders',
	RETURN_REASONS = '/admin/return-reasons',
	DISCOUNTS = '/admin/discounts',
	SUPPLIERS = '/admin/suppliers',
	SUPPLIER_ORDERS = '/admin/supplier-orders',
	GIFT_CARDS = '/admin/gift-cards',
	CURRENCIES = '/admin/currencies',
	WAREHOUSE_INBOUND = '/admin/warehouse/inbound',
	WAREHOUSE_OUTBOUND = '/admin/warehouse/outbound',
	WAREHOUSE_TRANSACTIONS = '/admin/warehouse/transactions',
	ITEM_UNIT = '/admin/item-unit',
	STOCK_CHECKER = '/admin/stock-checker',
	SHIP = '/admin/ship',
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
		mode: [EPermissions.Manager],
	},
	{
		path: ERoutes.PRODUCTS,
		mode: [
			EPermissions.Manager,
			EPermissions.Driver,
			EPermissions.Accountant,
			EPermissions.Warehouse,
		],
	},
	{
		path: ERoutes.DASHBOARD,
		mode: [
			EPermissions.Manager,
			EPermissions.Driver,
			EPermissions.Accountant,
			EPermissions.Warehouse,
		],
	},
	{
		path: ERoutes.PRODUCT_CATEGORIES,
		mode: [EPermissions.Manager],
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
	{
		path: ERoutes.WAREHOUSE_INBOUND,
		mode: [EPermissions.Warehouse, EPermissions.Manager],
	},
	{
		path: ERoutes.WAREHOUSE_OUTBOUND,
		mode: [EPermissions.Warehouse, EPermissions.Manager],
	},
	{
		path: ERoutes.WAREHOUSE_TRANSACTIONS,
		mode: [EPermissions.Warehouse, EPermissions.Manager],
	},
	{
		path: ERoutes.STOCK_CHECKER,
		mode: [EPermissions.Warehouse, EPermissions.Manager],
	},
	{
		path: ERoutes.SHIP,
		mode: [EPermissions.Driver, EPermissions.Manager],
	},
];
