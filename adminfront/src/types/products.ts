export interface IProductResponse {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	title: string;
  color: string;
  quantity: number;
  price: number;
  inventoryQuantity: number;
	metadata: JSON | null;
}

export interface IProductRequest {
  title: string;
  color: string;
  quantity: number;
  price: number;
  inventoryQuantity: number;
}