export enum KiotOrderStatus {
	SHIPPING = 2,
	COMPLETED = 3,
	CANCELLED = 4,
	CONFIRMED = 5,
}



export type WarehouseKiotWithInventory = {
	location?: string;
	warehouse_id?: string;
	unit_id?: string;
	sku: string;
}