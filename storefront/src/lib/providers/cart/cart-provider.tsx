'use client';
import { enrichLineItems, retrieveCart } from '@/modules/cart/action';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Cart, LineItem } from '@medusajs/medusa';
import { createContext, useContext, useEffect, useState } from 'react';

type CartContextType = {
	cart: Cart | null;
	refreshCart: () => Promise<void>;
	selectedCartItems: CartWithCheckoutStep;
	setSelectedCartItems: (items: CartWithCheckoutStep) => void;
	currentStep: number;
  setCurrentStep: (step: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [cart, setCart] = useState<Cart | null>(null);
	const [selectedCartItems, setSelectedCartItems] =
		useState<CartWithCheckoutStep>({} as CartWithCheckoutStep);
	const [currentStep, setCurrentStep] = useState<number>(0);

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
		<CartContext.Provider
			value={{
				cart,
				refreshCart,
				selectedCartItems,
				setSelectedCartItems,
				currentStep,
        setCurrentStep,
			}}
		>
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
