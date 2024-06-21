'use client';
import { enrichLineItems, retrieveCart } from '@/modules/cart/action';
import { Cart, LineItem } from '@medusajs/medusa';
import { createContext, useContext, useEffect, useState } from 'react';

type CartContextType = {
  cart: Cart | null;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);

  const fetchCart = async () => {
    const cart = await retrieveCart();
    if (cart?.items.length) {
      const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id);
      cart.items = enrichedItems as LineItem[];
    }
    setCart(cart as Cart);
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
