export type LineItem = {
	variantId: string;
	quantity: number;
	unit_price?: number;
};

export type CreateSupplierOrderInput = {
	lineItems: LineItem[];
	supplierId: string;
	userId: string;
	email: string;
	countryCode: string;
	region_id: string;
	currency_code: string;
	estimated_production_time: Date;
	settlement_time: Date;
	document_url: string;
	metadata?: Record<string, unknown>;
};

export type DeleteSupplierOrderLineItem = {
  supplierOrderId: string;
	lineItemId: string;
};

export type CreateSupplierOrderDocument = {
	documents: string | string[];
}