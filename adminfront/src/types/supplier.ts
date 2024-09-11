export interface Supplier {
	id: string;
	email: string;
	supplier_name: string;
	phone: string;
	address: string;
	default_estimated_production_time: number;
	default_settlement_time: number;
	metadata: Record<string, any>;
	created_at: string;
	updated_at: string;
}

export interface SupplierListResponse {
	suppliers: Supplier[];
	count: number;
	offset: number;
	limit: number;
}

export interface SupplierOrders {
	id: string;
	display_id: number;
	supplier_id: string;
	user_id: string;
	cart_id: string;
	status: string;
	payment_status: string;
	fulfillment_status: string;
	estimated_production_time: string;
	settlement_time: string;
	tax_rate: number;
	metadata: Record<string, any>;
	no_notification?: boolean;
	created_at: string;
	updated_at: string;
	canceled_at?: string | null;
}

export interface SupplierOrdersListResponse {
	orders: SupplierOrders[];
	count: number;
	offset: number;
	limit: number;
}
