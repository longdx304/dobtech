'use client';
import { BadgeButton } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { Cart } from '@medusajs/medusa';
import { ShoppingCart } from 'lucide-react';
import CartContent from './cart-content';
import { useRouter } from 'next/navigation';

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

	
	const router = useRouter();

	const handleClick = () => {
		router.push('/cart');
	};

	return (
		<Dropdown
			dropdownRender={() => cartContent}
			overlayStyle={{
				backgroundColor: 'white',
				borderRadius: '8px',
				boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
			}}
		>
			<BadgeButton
				icon={<ShoppingCart className="stroke-2" onClick={handleClick} />}
				count={totalItems}
				showZero
				offset={[0, 10]}
			/>
		</Dropdown>
	);
};

export default CartDropdown;
