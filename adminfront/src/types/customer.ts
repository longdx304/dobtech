import { Customer } from '@medusajs/medusa';
import { Address } from '@medusajs/medusa';

export interface ICustomerResponse extends Customer {
  customer_code: string | null;
  shipping_address?: Address | null;
}