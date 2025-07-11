import { PaginatedResponse, User } from '@medusajs/medusa';
import { ItemUnit } from './item-unit';
import { ProductVariant } from './products';

export interface Warehouse {
	id: string;
	location: string;
	capacity?: number;
	created_at: string;
	updated_at: string;
	inventories: WarehouseInventory[];
}
export interface KiotWarehouse {
	id: string;
	location: string;
	created_at: string;
	updated_at: string;
}

export interface AdminPostWarehouseReq {
	location: string;
	capacity?: number;
}

export interface AdminPostWarehouseInventoryKiotReq {
	warehouse_id: string;
	sku: string;
	quantity: number;
	unit_id: string;
}

export interface AdminPostManageWarehouseVariantReq {
	location: string;
	variant_id: string;
	warehouse_id?: string;
	quantity: number;
	unit_id: string;
	type: string;
	note?: string;
}

type AdminPostWarehouseRes = {
	warehouse_id?: string;
	location: string;
	variant_id: string;
	capacity?: number;
	unit_id: string;
};

type AdminPostWarehouseResKiot = {
	warehouse_id?: string;
	location: string;
	unit_id: string;
	sku: string;
};

export type AdminPostItemData = {
	variant_id: string;
	quantity: number;
	unit_id: string;
	line_item_id: string;
	order_id: string;
	type: string;
};

export type AdminPostItemDataKiot = {
	sku: string;
	quantity: number;
	unit_id: string;
	line_item_id: string;
	order_id: string;
	type: string;
};

export interface AdminPostWarehouseVariantReq1 {
	warehouse: AdminPostWarehouseRes;
	itemInventory: AdminPostItemData;
}

export interface AdminPostWarehouseInventoryKiotReq {
	warehouse: AdminPostWarehouseResKiot;
	itemInventory: AdminPostItemDataKiot;
}

export interface AdminPostWarehouseVariantReq {
	warehouse_id?: string;
	location: string;
	variant_id: string;
	capacity?: number;
}

export type AdminWarehouseRes = {
	warehouse: Warehouse;
};

export type AdminWarehousesListRes = PaginatedResponse & {
	warehouse: Warehouse[];
};

export type AdminWarehouseKiotRes = {
	warehouse: Warehouse;
};

export type AdminWarehousesKiotListRes = PaginatedResponse & {
	warehouses: Warehouse[];
};

export type AdminWarehouseDeleteRes = {
	id: string;
	object: string;
	deleted: boolean;
};

export type AdminInventoryRemoveRes = {};

export type WarehouseInventory = {
	id: string;
	warehouse_id: string;
	variant_id: string;
	quantity: number;
	unit_id: string;
	item_unit: ItemUnit;
	variant: ProductVariant;
	warehouse: Warehouse;
	created_at: string;
	updated_at: string;
	user_id: string;
	user: User;
};

export interface AdminPostInboundInventoryReq {
	id?: string;
	warehouse_id?: string;
	variant_id: string;
	quantity: number;
	unit_id: string;
	line_item_id: string;
	order_id?: string;
	type?: string;
	note?: string;
}

export interface OrderInWarehouseKiot {
	unit_id: string;
	line_item_id: string;
	sku: string;
	warehouse_inventory_id: string;
	quantity: number;
	order_id: string;
	warehouse_id: string;
	type: 'INBOUND' | 'OUTBOUND';
	user_id?: string;
}

export interface AdminPostManageInventoryWarehouseReq {
	id?: string;
	warehouse_id?: string;
	variant_id: string;
	quantity: number;
	unit_id: string;
	note?: string;
}

export interface AdminPostRemmoveInventoryReq {
	unit_id: string;
	line_item_id: string;
	variant_id: string;
	warehouse_inventory_id: string;
	quantity: number;
	order_id?: string;
	warehouse_id: string;
	type: 'INBOUND' | 'OUTBOUND';
}
export interface AdminPostCreateOutboundInventoryReq {
	unit_id: string;
	line_item_id: string;
	variant_id: string;
	warehouse_inventory_id: string;
	quantity: number;
	order_id?: string;
	warehouse_id: string;
	type: 'OUTBOUND';
}

export type AdminWarehouseTransactionsRes = {
	inventoryTransactions: WarehouseInventory[];
	count: number;
};
export type AdminWarehouseTransactionsResKiot = {
	transactions: KiotTransaction[];
	count: number;
};

export enum TransactionType {
	INBOUND = 'INBOUND',
	OUTBOUND = 'OUTBOUND',
}

export type KiotTransaction = {
	id: string;
	warehouse_id: string;
	sku: string;
	order_id?: string;
	quantity: number;
	type: TransactionType;
	note?: string;
	warehouse: KiotWarehouse;
	user_id: string;
	user: User;
	created_at: string;
	updated_at: string;
};
export type KiotTransactionSkuRes = {
	transactions: KiotTransaction[];
	count: number;
};

export type AdminTransaction = {
	id: string;
	warehouse_id: string;
	variant_id: string;
	order_id?: string;
	quantity: number;
	type: TransactionType;
	note?: string;
	warehouse: Warehouse;
	user_id: string;
	user: User;
	created_at: string;
	updated_at: string;
};

export type AdminTransactionVariantIdRes = {
	transactions: AdminTransaction[];
	count: number;
};
