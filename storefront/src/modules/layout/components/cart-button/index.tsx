import { enrichLineItems, retrieveCart } from '@/modules/cart/action';
import { LineItem } from '@medusajs/medusa';
import { useEffect, useState } from 'react';
import CartDropdown from '../cart-dropdown';

export default function CartButton() {
  const [cart, setCart] = useState(null);

  async function fetchCart() {
    const cart = await retrieveCart();

    if (cart?.items.length) {
      const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id);
      cart.items = enrichedItems as LineItem[];
    }

    return cart;
  }
  async function getCart() {
    const cart = await fetchCart();
    setCart(cart as any);
  }

  // Fetch cart on component mount
  useEffect(() => {
    getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <CartDropdown cart={cart} />;
}
