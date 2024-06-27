import { Address, Cart } from '@medusajs/medusa';
import React from 'react'

type AddressSelectProps = {
  addresses: Address[]
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
}

const AddressSelect = ({ addresses, cart }: AddressSelectProps) => {
  return (
    <div>AddressSelect</div>
  )
}

export default AddressSelect