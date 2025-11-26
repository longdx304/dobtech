import { EPermissions } from './account';

export enum ERoutes {
	LOGIN = '/login',
	HOME = '/admin',
	ACCOUNTS = '/admin/accounts',
	PRODUCTS = '/admin/products',
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
	SUPPLIER_DRAFT_ORDERS = '/admin/supplier-draft-orders',
	GIFT_CARDS = '/admin/gift-cards',
	CURRENCIES = '/admin/currencies',
	WAREHOUSE_INBOUND = '/admin/warehouse/inbound',
	WAREHOUSE_OUTBOUND = '/admin/warehouse/outbound',
	WAREHOUSE_TRANSACTIONS = '/admin/warehouse/transactions',
	ITEM_UNIT = '/admin/item-unit',
	WAREHOUSE_STOCK_CHECKER = '/admin/warehouse/stock-checker',
	WAREHOUSE_SHIPMENT = '/admin/warehouse/shipment',
	WAREHOUSE_MANAGE = '/admin/warehouse/manage',
	WAREHOUSE_INVENTORY_CHECKER = '/admin/warehouse/inventory-checker',

	// KIOT system routes
	KIOT_HOME = '/kiot',
	KIOT_ACCOUNTS = '/kiot/accounts',
	KIOT_WAREHOUSE_INBOUND = '/kiot/warehouse/inbound',
	KIOT_WAREHOUSE_OUTBOUND = '/kiot/warehouse/outbound',
	KIOT_WAREHOUSE_TRANSACTIONS = '/kiot/warehouse/transactions',
	KIOT_ITEM_UNIT = '/kiot/item-unit',
	KIOT_WAREHOUSE_STOCK_CHECKER = '/kiot/warehouse/stock-checker',
	KIOT_WAREHOUSE_MANAGE = '/kiot/warehouse/manage',
	KIOT_WAREHOUSE_INVENTORY_CHECKER = '/kiot/warehouse/inventory-checker',
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
		path: ERoutes.HOME,
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
		mode: [EPermissions.Manager],
	},
	{
		path: ERoutes.CUSTOMERS,
		mode: [EPermissions.Manager],
	},
	{
		path: ERoutes.REGIONS,
		mode: [EPermissions.Manager],
	},
	{
		path: ERoutes.ORDERS,
		mode: [EPermissions.Manager],
	},
	{
		path: ERoutes.RETURN_REASONS,
		mode: [EPermissions.Manager],
	},
	{
		path: ERoutes.DISCOUNTS,
		mode: [EPermissions.Manager],
	},
	{
		path: ERoutes.GIFT_CARDS,
		mode: [EPermissions.Manager],
	},
	{
		path: ERoutes.SUPPLIERS,
		mode: [EPermissions.Manager, EPermissions.Accountant],
	},
	{
		path: ERoutes.SUPPLIER_ORDERS,
		mode: [EPermissions.Manager, EPermissions.Accountant],
	},
	{
		path: ERoutes.CURRENCIES,
		mode: [EPermissions.Manager],
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
		path: ERoutes.WAREHOUSE_STOCK_CHECKER,
		mode: [EPermissions.Warehouse, EPermissions.Manager],
	},
	{
		path: ERoutes.WAREHOUSE_SHIPMENT,
		mode: [EPermissions.Driver, EPermissions.Manager],
	},
	{
		path: ERoutes.WAREHOUSE_MANAGE,
		mode: [EPermissions.Driver, EPermissions.Manager],
	},
	{
		path: ERoutes.WAREHOUSE_INVENTORY_CHECKER,
		mode: [EPermissions.Driver, EPermissions.Manager],
	},
	{
		path: ERoutes.KIOT_WAREHOUSE_MANAGE,
		mode: [EPermissions.Warehouse, EPermissions.Manager],
	},
	{
		path: ERoutes.KIOT_WAREHOUSE_OUTBOUND,
		mode: [EPermissions.Warehouse, EPermissions.Manager],
	},
	{
		path: ERoutes.KIOT_WAREHOUSE_STOCK_CHECKER,
		mode: [EPermissions.Warehouse, EPermissions.Manager],
	},

	// KIOT system routes configuration
	{
		path: ERoutes.KIOT_HOME,
		mode: [
			EPermissions.Manager,
			EPermissions.Driver,
			EPermissions.Accountant,
			EPermissions.Warehouse,
		],
	},
	{
		path: ERoutes.KIOT_ACCOUNTS,
		mode: [EPermissions.Manager, EPermissions.Accountant],
	},
];
