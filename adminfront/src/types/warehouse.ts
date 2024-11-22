import { ItemUnit } from "./item-unit";

export interface Warehouse {
	id: string;
	location: string;
	capacity: number;
	created_at: string;
	updated_at: string;
}

export interface AdminPostWarehouseReq {
	location: string;
	capacity?: number;
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

export type AdminWarehousesListRes = {
	warehouse: Warehouse[];
};


export type AdminWarehouseDeleteRes = {
	id: string;
	object: string;
	deleted: boolean;
};

export type WarehouseInventory = {
  id: string;
  warehouse_id: string;
  variant_id: string;
  quantity: number;
  unit_id: string;
  item_unit: ItemUnit;
  warehouse: Warehouse;
	created_at: string;
	updated_at: string;
}
