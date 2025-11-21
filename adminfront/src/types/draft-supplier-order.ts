import { Cart, Payment, Refund, Region, User } from '@medusajs/medusa';
import { Supplier, SupplierOrderDocument } from './supplier';
import { LineItem } from './lineItem';

export interface DraftSupplierOrder {
	id: string;
	cart_id: string;
	cart: Cart;
	display_id: number;
	display_name?: string;
	supplier_id: string;
	supplier: Supplier;
	documents: SupplierOrderDocument[];
	user_id: string;
	currency_code: string;
	region_id: string;
	region?: Region;
	user: User;
	status: string;
	payment_status: string;
	payments: Payment[];
	fulfillment_status: string;
	estimated_production_time: string;
	settlement_time: string;
	shipping_started_date?: string | Date;
	warehouse_entry_date?: string | Date;
	completed_payment_date?: string | Date;
	items: LineItem[];
	tax_rate: number;
	metadata: Record<string, any>;
	subtotal: number;
	total: number;
	tax_total: number;
	paid_total: number;
	refunded_total: number;
	refunds: Refund[];
	no_notification?: boolean;
	created_at: string | Date;
	updated_at: string | Date;
	canceled_at?: string | null;
}

export interface DraftSupplierOrderListRes {
	draft_supplier_orders: DraftSupplierOrder[];
	count: number;
	offset: number;
	limit: number;
}

export interface DraftSupplierOrderRes {
	draft_supplier_order: DraftSupplierOrder;
}

export type DraftSupplierOrderQueryParams = {
	q?: string;
	offset?: number;
	limit?: number;
	status?: string;
	fulfillment_status?: string;
};

export type LineItemReq = {
	variant_id: string;
	quantity: number;
	unit_price?: number;
	metadata?: Record<string, any>;
};

export type CreateDraftSupplierOrderReq = {
	supplier_id: string;
	user_id: string;
	email: string;
	region_id: string;
	country_code: string;
	currency_code: string;
	line_items: LineItemReq[];
	estimated_production_time?: Date | string;
	settlement_time?: Date | string;
	shipping_started_date?: Date | string;
	warehouse_entry_date?: Date | string;
	completed_payment_date?: Date | string;
	metadata?: Record<string, unknown>;
};

export type UpdateDraftSupplierOrderReq = {
	supplier_id?: string;
	region_id?: string;
	country_code?: string;
	currency_code?: string;
	estimated_production_time?: Date | string;
	settlement_time?: Date | string;
	shipping_started_date?: Date | string;
	warehouse_entry_date?: Date | string;
	completed_payment_date?: Date | string;
	metadata?: Record<string, unknown>;
};

export type AddLineItemsReq = {
	line_items: LineItemReq[];
};

export type CompleteReq = {
	no_notification?: boolean;
};

