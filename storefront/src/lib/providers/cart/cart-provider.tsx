'use client';
import {
	enrichLineItems,
	retrieveCart,
	updateLineItem,
} from '@/modules/cart/action';
import { deleteCartCheckout, listAllCart } from '@/modules/checkout/actions';
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
	allCarts: Cart[];
	refreshCart: () => Promise<void>;
	updateCartItem: (
		lineId: string,
		quantity: number,
		checkoutCartId?: string
	) => Promise<void>;
	selectedCartItems: CartWithCheckoutStep | null;
	setSelectedCartItems: (items: CartWithCheckoutStep) => void;
	currentStep: number;
	setCurrentStep: (step: number) => void;
	selectedAddress: Address | null;
	setSelectedAddress: (address: Address) => void;
	deleteAndRefreshCart: (cartId: string) => Promise<void>;
	isProcessing: boolean;
	setIsProcessing: (action: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

interface Props {
	children: ReactNode;
}

export const CartProvider: React.FC<Props> = ({ children }) => {
	const [cart, setCart] = useState<Cart | null>(null);
	const [allCarts, setAllCarts] = useState<Cart[]>([]);
	const [selectedCartItems, setSelectedCartItems] =
		useState<CartWithCheckoutStep | null>({} as CartWithCheckoutStep);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const fetchCart = async () => {
		const cart = await retrieveCart();

		if (cart?.items?.length) {
			const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id);
			cart.items = enrichedItems as LineItem[];
		}

		setCart(cart as Cart);

		return cart as Cart;
	};

	const fetchAllCarts = async () => {
		try {
			const allCarts = await listAllCart();
			setAllCarts(allCarts);
			return allCarts;
		} catch (e) {
			console.error('Error fetching all carts:', e);
			return [];
		}
	};

	/**
	 * Deletes a cart and refreshes the list of all carts.
	 *
	 * @param {string} cartId - The ID of the cart to be deleted.
	 * @return {Promise<void>} A promise that resolves when the cart is successfully deleted and the list of carts is refreshed.
	 * @throws {Error} If there is an error deleting the cart.
	 */
	const deleteAndRefreshCart = async (cartId: string) => {
		try {
			await deleteCartCheckout(cartId);
			await fetchAllCarts();
		} catch (error) {
			console.error('Error deleting cart:', error);
			throw error;
		}
	};

	/**
	 * Updates a cart item with the specified line ID, quantity, and optional checkout cart ID.
	 *
	 * @param {string} lineId - The ID of the line item to update.
	 * @param {number} quantity - The new quantity for the line item.
	 * @param {string} [checkoutCartId] - The optional checkout cart ID.
	 * @return {Promise<void>} A promise that resolves when the cart item is successfully updated and the cart is fetched.
	 */
	const updateCartItem = async (
		lineId: string,
		quantity: number,
		checkoutCartId?: string
	) => {
		await updateLineItem({ lineId, quantity, checkoutCartId });
		await fetchCart();
	};

	/**
	 * Updates the selected cart items based on the current cart.
	 * Filters the selected items based on IDs and computes the totals.
	 * Updates the selected cart items state with the latest data.
	 */
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

	/**
	 * Refreshes the cart by fetching the updated cart and all carts.
	 *
	 * @return {Promise<void>} A promise that resolves when the cart is successfully refreshed with the updated data.
	 */
	// const refreshCart = async () => {
	// 	const [updatedCart, updatedAllCarts] = await Promise.all([
	// 		fetchCart(),
	// 		fetchAllCarts(),
	// 	]);
	// 	setCart(updatedCart);
	// 	setAllCarts(updatedAllCarts);
	// };
	const refreshCart = async () => {
		setIsProcessing(true);
		try {
			const [updatedCart, updatedAllCarts] = await Promise.all([
				fetchCart(),
				fetchAllCarts(),
			]);
			setCart(updatedCart);
			setAllCarts(updatedAllCarts);
		} finally {
			setIsProcessing(false);
		}
	};

	useEffect(() => {
		refreshCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<CartContext.Provider
			value={{
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
				deleteAndRefreshCart,
				isProcessing,
				setIsProcessing,
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
