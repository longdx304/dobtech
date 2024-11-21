export interface Warehouse {
	id: string;
	location: string;
	capacity: number;
}

export interface AdminPostWarehouseReq {
	location: string;
	capacity?: number;
}
export interface AdminPostWarehouseVariantIdReq {
	warehouse_id?: string;
	location: string;
	variantId: string;
	capacity?: number;
}

export type AdminWarehouseRes = {
	warehouse: Warehouse;
};

export type AdminWarehousesListRes = {
	warehouses: Warehouse[];
};


export type AdminWarehouseDeleteRes = {
	id: string;
	object: string;
	deleted: boolean;
};
