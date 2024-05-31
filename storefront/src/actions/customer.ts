import { medusaClient } from '@/lib/database/config';
import { getMedusaHeaders } from './auth';
import { StorePostCustomersCustomerReq, StorePostCustomersReq } from '@medusajs/medusa';
import medusaError from '@/lib/utils/medusa-error';

// Customer actions
export async function getCustomer() {
  const headers = getMedusaHeaders(["customer"])

  return medusaClient.customers
    .retrieve(headers)
    .then(({ customer }) => customer)
    .catch((err) => null)
}

export async function createCustomer(data: StorePostCustomersReq) {
  const headers = getMedusaHeaders(["customer"])

  return medusaClient.customers
    .create(data, headers)
    .then(({ customer }) => customer)
    .catch((err) => medusaError(err))
}

export async function updateCustomer(data: StorePostCustomersCustomerReq) {
  const headers = getMedusaHeaders(["customer"])

  return medusaClient.customers
    .update(data, headers)
    .then(({ customer }) => customer)
    .catch((err) => medusaError(err))
}