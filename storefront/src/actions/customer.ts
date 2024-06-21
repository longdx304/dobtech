import { medusaClient } from '@/lib/database/config';
import { getMedusaHeaders } from './auth';
import {
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersCustomerAddressesReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
} from '@medusajs/medusa';
import medusaError from '@/lib/utils/medusa-error';

// Customer actions
export async function getCustomer() {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers
    .retrieve(headers)
    .then(({ customer }) => customer)
    .catch((err) => null);
}

export async function createCustomer(data: StorePostCustomersReq) {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers
    .create(data, headers)
    .then(({ customer }) => customer)
    .catch((err) => medusaError(err));
}

export async function updateCustomer(data: StorePostCustomersCustomerReq) {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers
    .update(data, headers)
    .then(({ customer }) => customer)
    .catch((err) => medusaError(err));
}

export async function addShippingAddress(
  data: StorePostCustomersCustomerAddressesReq
) {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers.addresses
    .addAddress(data, headers)
    .then(({ customer }) => customer)
    .catch((err) => medusaError(err));
}

export async function updateShippingAddress(
  addressId: string,
  data: StorePostCustomersCustomerAddressesAddressReq
) {
  const headers = getMedusaHeaders(["customer"])

  return medusaClient.customers.addresses
    .updateAddress(addressId, data, headers)
    .then(({ customer }) => customer)
    .catch((err) => medusaError(err))
}

export async function deleteShippingAddress(addressId: string) {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers.addresses
    .deleteAddress(addressId, headers)
    .then(({ customer }) => customer)
    .catch((err) => medusaError(err));
}