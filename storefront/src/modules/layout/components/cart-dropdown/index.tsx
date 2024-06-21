'use client';
import { BadgeButton } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { Cart } from '@medusajs/medusa';
import { ShoppingCart } from 'lucide-react';
import CartContent from './cart-content';

const CartDropdown = ({
	cart: cartState,
}: {
	cart?: Omit<Cart, 'beforeInsert' | 'afterLoad'> | null;
}) => {
	const totalItems =
		cartState?.items?.reduce((acc, item) => {
			return acc + item.quantity;
		}, 0) || 0;

	const cartContent = <CartContent cart={cartState} />;

	return (
		<Dropdown
			// open={true}
			dropdownRender={() => cartContent}
			overlayStyle={{
				backgroundColor: 'white',
				borderRadius: '8px',
				boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
				// height: 'calc(100% - 100px)',
			}}
		>
			<BadgeButton
				icon={<ShoppingCart className="stroke-2" />}
				count={totalItems}
				showZero
				offset={[0, 10]}
			/>
		</Dropdown>
	);
};

export default CartDropdown;
