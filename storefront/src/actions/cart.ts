import { medusaClient } from '@/lib/database/config';
import medusaError from '@/lib/utils/medusa-error';
import { StorePostCartsCartReq } from '@medusajs/medusa';
import { cache } from 'react';
import { getMedusaHeaders } from './auth';

// Cart actions
export async function createCart(data = {}) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .create(data, headers)
    .then(({ cart }) => cart)
    .catch((err) => {
      console.log(err);
      return null;
    });
}

export async function updateCart(cartId: string, data: StorePostCartsCartReq) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .update(cartId, data, headers)
    .then(({ cart }) => cart)
    .catch((error) => medusaError(error));
}

export const getCart = cache(async function (cartId: string) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .retrieve(cartId, headers)
    .then(({ cart }) => cart)
    .catch((err) => {
      console.log(err);
      return null;
    });
});

export async function addItem({
  cartId,
  variantId,
  quantity,
}: {
  cartId: string;
  variantId: string;
  quantity: number;
}) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts.lineItems
    .create(cartId, { variant_id: variantId, quantity }, headers)
    .then(({ cart }) => cart)
    .catch((err) => {
      console.log(err);
      return null;
    });
}

export async function updateItem({
  cartId,
  lineId,
  quantity,
}: {
  cartId: string;
  lineId: string;
  quantity: number;
}) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts.lineItems
    .update(cartId, lineId, { quantity }, headers)
    .then(({ cart }) => cart)
    .catch((err) => medusaError(err));
}

export async function removeItem({
  cartId,
  lineId,
}: {
  cartId: string;
  lineId: string;
}) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts.lineItems
    .delete(cartId, lineId, headers)
    .then(({ cart }) => cart)
    .catch((err) => {
      console.log(err);
      return null;
    });
}

export async function completeCart(cartId: string) {
  const headers = getMedusaHeaders(["cart"])

  return medusaClient.carts
    .complete(cartId, headers)
    .then((res) => res)
    .catch((err) => medusaError(err))
}