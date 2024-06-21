'use client';
import { useCart } from '@/lib/providers/cart/cart-provider';
import CartDropdown from '../cart-dropdown';

export default function CartButton() {
	const { cart } = useCart();

	return <CartDropdown cart={cart} />;
}
