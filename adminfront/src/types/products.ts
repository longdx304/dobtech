export interface IProductResponse {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	title: string;
	sizes?: string[];
	variants: IProductVariant[];
	options: IProductOptions[];
	color: string;
	quantity: number;
	price: number;
	inventoryQuantity: number;
	metadata: JSON | null;
}

interface IProductVariant {
	id: string;
	title: string;
	prices: { amount: number; currency_code: string }[];
	inventory_quantity: number;
	options: {
		[x: string]: string;
		value: string;
	}[];
}

interface IProductOptions {
	title: string;
	values: { value: string; variant_id: string }[];
}

export interface IProductRequest {
	title: string;
	sizes?: string[];
	color: string;
	quantity: number;
	price: number;
	inventoryQuantity: number;
	variants?: any[];
	options?: any[];
}
