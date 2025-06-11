import { LineItem as MedusaLineItem } from '@medusajs/medusa';

export interface LineItem extends MedusaLineItem {
	warehouse_quantity: number;
}

export interface LineItemKiot {
	id: string;
	order_id: number;
	warehouse_quantity: number;
	warehouse_id?: string;
	product_code: string;
	quantity: number;
	unit_id: string;
}
