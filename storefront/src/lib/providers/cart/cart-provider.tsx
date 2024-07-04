'use client';
import {
	enrichLineItems,
	retrieveCart,
	updateLineItem,
} from '@/modules/cart/action';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Address, Cart, LineItem } from '@medusajs/medusa';
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

// Function to compute totals
const computeTotals = (items: LineItem[]) => {
	let subtotal = 0;
	let discount_total = 0;
	let tax_total = 0;
	let shipping_total = 0;

	items.forEach((item: LineItem) => {
		subtotal += item.unit_price * item.quantity;
	});

	const total = subtotal + tax_total + shipping_total - discount_total;
	return {
		subtotal,
		discount_total,
		gift_card_total: 0,
		tax_total,
		shipping_total,
		total,
	};
};

type CartContextType = {
	cart: Cart | null;
	refreshCart: () => Promise<void>;
	updateCartItem: (lineId: string, quantity: number) => Promise<void>;
	selectedCartItems: CartWithCheckoutStep | null;
	setSelectedCartItems: (items: CartWithCheckoutStep) => void;
	currentStep: number;
	setCurrentStep: (step: number) => void;
	selectedAddress: Address | null;
	setSelectedAddress: (address: Address) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

interface Props {
	children: ReactNode;
}

export const CartProvider: React.FC<Props> = ({ children }) => {
	const [cart, setCart] = useState<Cart | null>(null);
	const [selectedCartItems, setSelectedCartItems] =
		useState<CartWithCheckoutStep | null>({} as CartWithCheckoutStep);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

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

	const updateCartItem = async (lineId: string, quantity: number) => {
		await updateLineItem({ lineId, quantity });
		await fetchCart();
	};

	// update selected items when cart changes
	useEffect(() => {
		if (cart) {
			// Filter selected items based on IDs
			const selectedItems = cart?.items?.filter((item) =>
				selectedCartItems?.items?.some(
					(selectedItem) => selectedItem.id === item.id
				)
			);
			const totals = computeTotals(selectedItems);

			// compare with cart to get the latest data
			const selectedCartAddress = cart?.shipping_address;

			setSelectedCartItems(
				(prevSelectedCartItems) =>
					({
						...prevSelectedCartItems,
						items: selectedItems,
						total: totals.total,
						subtotal: totals.subtotal,
						shipping_address: selectedCartAddress,
					} as CartWithCheckoutStep)
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cart]);

	useEffect(() => {
		fetchCart();
	}, []);

	return (
		<CartContext.Provider
			value={{
				cart,
				refreshCart,
				updateCartItem,
				selectedCartItems,
				setSelectedCartItems,
				currentStep,
				setCurrentStep,
				selectedAddress,
				setSelectedAddress,
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
