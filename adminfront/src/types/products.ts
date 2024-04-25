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
	categories?: IProductCategory[];
}

export interface IProductCategory {
	id: string;
	created_at: string;
	updated_at: string;
	name: string;
	description: string;
	handle: string;
	is_active: boolean;
	is_internal: boolean;
	parent_category_id: string | null;
	rank: number;
	metadata: any | null;
	category_children: IProductCategory[];
	parent_category: IProductCategory | null;
}

export interface IProductVariant {
	id: string;
	title: string;
	prices: { amount: number; currency_code: string }[];
	inventory_quantity: number;
	options: {
		[x: string]: string;
		value: string;
	}[];
}

export interface IProductOptions {
	id: string;
	title: string;
	values: { value: string; variant_id: string }[];
}

export interface IProductRequest {
	title: string;
	categories: IProductCategory[];
	sizes: string[];
	color: string;
	quantity: number;
	price: number;
	inventoryQuantity: number;
	variants?: IProductVariant[];
	options?: IProductOptions[];
}
