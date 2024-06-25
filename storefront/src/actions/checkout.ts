import { medusaClient } from '@/lib/database/config';
import { getMedusaHeaders } from './auth';
import { cache } from 'react';
import medusaError from '@/lib/utils/medusa-error';

export async function createPaymentSessions(cartId: string) {
  const headers = getMedusaHeaders(["cart"])

  return medusaClient.carts
    .createPaymentSessions(cartId, headers)
    .then(({ cart }) => cart)
    .catch((err) => {
      console.log(err)
      return null
    })
}

// Shipping actions
export const listCartShippingMethods = cache(async function (cartId: string) {
  const headers = getMedusaHeaders(["shipping"])

  return medusaClient.shippingOptions
    .listCartOptions(cartId, headers)
    .then(({ shipping_options }) => shipping_options)
    .catch((err) => {
      console.log(err)
      return null
    })
})

export async function addShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = getMedusaHeaders(["cart"])

  return medusaClient.carts
    .addShippingMethod(cartId, { option_id: shippingMethodId }, headers)
    .then(({ cart }) => cart)
    .catch((err) => medusaError(err))
}