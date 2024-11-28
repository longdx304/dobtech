import {
	Cart,
	OrderEdit,
	Payment,
	User,
} from '@medusajs/medusa';
import { LineItem } from './lineItem';

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
	region_id: string;
	countryCode: string;
	currency_code: string;
	estimated_production_time: Date;
	settlement_time: Date;
	document_url: string;
	metadata?: Record<string, unknown>;
}

export interface AddOrderEditLineItemInput {
	variant_id: string;
	quantity: number;
	unit_price?: number;
	metadata?: Record<string, any>;
}

// export interface UpdateLineItemSupplierOrderReq {
// 	cartId: string;
// 	lineItems: UpdateLineItem[];
// 	metadata?: Record<string, any>;
// }

export interface SupplierOrders {
	id: string;
	display_id: number;
	supplier_id: string;
	user_id: string;
	cart_id: string;
	status: string;
	payment_status: string;
	fulfillment_status: FulfillSupplierOrderStt;
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

export interface SupplierOrderDocument {
	id: string;
	document_url: string;
	supplier_order_id: string;
	created_at: Date;
	updated_at: Date;
	metadata: Record<string, any>;
}

export interface SupplierOrder {
	id: string;
	cart_id: string;
	cart: Cart;
	display_id: number;
	supplier_id: string;
	supplier: Supplier;
	documents: SupplierOrderDocument[];
	user_id: string;
	currency_code: string;
	region_id: string;
	user: User;
	status: string;
	payment_status: string;
	payments?: Payment[];
	fulfillment_status: FulfillSupplierOrderStt;
	estimated_production_time: string;
	settlement_time: string;
	items: LineItem[];
	tax_rate: number;
	metadata: Record<string, any>;
	subtotal: number;
	total: number;
	tax_total: number;
	paid_total: number;
	refunded_total: number;
	no_notification?: boolean;
	created_at: string;
	updated_at: string;
	canceled_at?: string | null;
	delivered_at?: string;
	inventoried_at?: string;
	rejected_at?: string;
}

export interface SupplierOrderEdit extends OrderEdit {
	supplier_order_id?: string;
}

export interface SupplierOrderDocumentRes {
	documents: string | string[];
}


export enum FulfillSupplierOrderStt {
	NOT_FULFILLED = 'not_fulfilled',
	DELIVERED = 'delivered',
	INVENTORIED = 'inventoried',
	REJECTED = 'rejected',
}

export type MarkAsFulfilledReq = {
	status: FulfillSupplierOrderStt;
};
export type MarkAsFulfilledRes = any;
