
export interface Supplier {
	id: string;
	email: string;
	supplier_name: string;
	phone: string;
	address: string;
	estimated_production_time: number;
	settlement_time: number;
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

export interface LineItemReq {
	variantId: string;
	quantity: number;
	unit_price?: number;
}

export interface SupplierOrdersReq {
	lineItems: LineItemReq[];
	supplierId: string;
	userId: string;
	email: string;
	countryCode: string;
	estimated_production_time: Date;
	settlement_time: Date;
	document_url: string;
	metadata?: Record<string, unknown>;
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

export interface SupplierOrderListRes {
	supplierOrder: SupplierOrders[];
	count: number;
	offset: number;
	limit: number;
}

