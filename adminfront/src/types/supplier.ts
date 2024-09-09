export interface Supplier {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  supplier_name: string;
  phone: string;
  address: string;
  default_estimated_production_time: number;
  default_settlement_time: number;
  metadata: Record<string, any>;
}


export interface SupplierListResponse {
  suppliers: Supplier[];
  count: number;
  offset: number;
  limit: number;
}