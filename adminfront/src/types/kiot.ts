export enum KiotInvoiceStatus {
	COMPLETED = 1,
	PROCESSING = 3,
}
export type WarehouseKiotInventory = {
	id: string;
	warehouse_id: string;
	unit_id: string;
	sku: string;
	quantity: number;
	item_unit: WarehouseKiotUnit;
	warehouse?: WarehouseKiotWarehouse;
};

export type WarehouseKiot = {
	id: string;
	location: string;
	created_at: string;
	updated_at: string;
	inventories: WarehouseKiotInventory[];
};

export type WarehouseKiotList = {
	warehouses: WarehouseKiot[];
	count: number;
};

export type WarehouseKiotWithInventory = {
	location?: string;
	warehouse_id?: string;
	unit_id?: string;
	sku: string;
	quantity?: number;
};

export type WarehouseKiotBySku = {
	sku: string;
	records: WarehouseKiotRecord[];
};

export type WarehouseKiotUnit = {
	id: string;
	unit: string;
	quantity: number;
};
export type WarehouseKiotWarehouse = {
	id: string;
	location: string;
};

export type WarehouseKiotRecord = {
	id: string;
	warehouse_id: string;
	unit_id: string;
	sku: string;
	quantity: number;
	item_unit: WarehouseKiotUnit;
	warehouse?: WarehouseKiotWarehouse;
};

export type WarehouseKiotBySkuResponse = {
	inventoryBySku: WarehouseKiotBySku[];
	count: number;
};

export type WarehouseKiotVariantReq = {
	location?: string;
	unit_id: string;
	sku: string;
	warehouse_inventory_id: string;
	quantity: number;
	warehouse_id: string;
	type: 'INBOUND' | 'OUTBOUND';
};

export enum OrderKiotType {
	INBOUND = 'INBOUND',
	OUTBOUND = 'OUTBOUND',
}
