'use client';
import { addItem, removeItem } from '@/actions/cart';
import {
	enrichLineItems,
	retrieveCart,
	updateLineItem,
} from '@/modules/cart/action';
import { listAllCart } from '@/modules/checkout/actions';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Address, Cart, LineItem } from '@medusajs/medusa';
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	useMemo,
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
	allCarts: Cart[];
	refreshCart: () => Promise<void>;
	updateCartItem: (
		lineId: string,
		quantity: number,
		checkoutCartId?: string
	) => Promise<void>;
	selectedCartItems: CartWithCheckoutStep | null;
	setSelectedCartItems: (items: CartWithCheckoutStep | null) => void;
	currentStep: number;
	setCurrentStep: (step: number) => void;
	selectedAddress: Address | null;
	setSelectedAddress: (address: Address | null) => void;
	isProcessing: boolean;
	setIsProcessing: (processing: boolean) => void;
	updateExistingCart: (cartId: string, newItems: LineItem[]) => Promise<void>;
	refreshAllCarts: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type Props = {
	children: ReactNode;
};

export const CartProvider = ({ children }: Props) => {
	const [cart, setCart] = useState<Cart | null>(null);
	const [allCarts, setAllCarts] = useState<Cart[]>([]);
	const [selectedCartItems, setSelectedCartItems] =
		useState<CartWithCheckoutStep | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const refreshCart = useCallback(async () => {
		try {
			setIsProcessing(true);
			const cartData = await retrieveCart();
			if (cartData) {
				if (cartData?.items?.length) {
					const enrichedItems = await enrichLineItems(
						cartData?.items,
						cartData?.region_id
					);
					cartData.items = enrichedItems as LineItem[];
				}
				setCart(cartData as Cart);
			}
		} catch (error) {
			console.error('Error refreshing cart:', error);
		} finally {
			setIsProcessing(false);
		}
	}, []);

	const refreshAllCarts = useCallback(async () => {
		try {
			const carts = await listAllCart();
			if (carts?.length) {
				setAllCarts(carts);
			}
		} catch (error) {
			console.error('Error refreshing all carts:', error);
		}
	}, []);

	const updateCartItem = useCallback(
		async (lineId: string, quantity: number, checkoutCartId?: string) => {
			try {
				setIsProcessing(true);
				await updateLineItem({
					lineId,
					quantity,
					checkoutCartId,
				});
				await refreshCart();
			} catch (error) {
				console.error('Error updating cart item:', error);
			} finally {
				setIsProcessing(false);
			}
		},
		[refreshCart]
	);

	const updateExistingCart = useCallback(
		async (cartId: string, newItems: LineItem[]) => {
			try {
				setIsProcessing(true);
				// Remove existing items
				if (cart?.items) {
					for (const item of cart.items) {
						await removeItem({
							cartId: cartId,
							lineId: item.id,
						});
					}
				}

				// Add new items
				for (const item of newItems) {
					await addItem({
						cartId: cartId,
						variantId: item.variant_id!,
						quantity: item.quantity,
					});
				}

				await refreshCart();
			} catch (error) {
				console.error('Error updating existing cart:', error);
			} finally {
				setIsProcessing(false);
			}
		},
		[cart?.items, refreshCart]
	);

	// Update selected cart items when cart changes
	useEffect(() => {
		if (cart && selectedCartItems) {
			const selectedIds = selectedCartItems.items.map((item) => item.id);
			const updatedItems = cart.items.filter((item) =>
				selectedIds.includes(item.id)
			);

			if (updatedItems.length > 0) {
				const totals = computeTotals(updatedItems);
				setSelectedCartItems({
					...cart,
					items: updatedItems,
					...totals,
				} as CartWithCheckoutStep);
			}
		}
	}, [cart, selectedCartItems]);

	// Initial fetch
	useEffect(() => {
		refreshCart();
		refreshAllCarts();
	}, [refreshCart, refreshAllCarts]);

	const contextValue = useMemo(
		() => ({
			cart,
			allCarts,
			refreshCart,
			updateCartItem,
			selectedCartItems,
			setSelectedCartItems,
			currentStep,
			setCurrentStep,
			selectedAddress,
			setSelectedAddress,
			isProcessing,
			setIsProcessing,
			updateExistingCart,
			refreshAllCarts,
		}),
		[
			cart,
			allCarts,
			refreshCart,
			updateCartItem,
			selectedCartItems,
			currentStep,
			selectedAddress,
			isProcessing,
			updateExistingCart,
			refreshAllCarts,
		]
	);

	return (
		<CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
};

export default CartProvider;
