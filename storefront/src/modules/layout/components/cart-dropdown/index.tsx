'use client';
import { BadgeButton } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import useIsDesktop from '@/modules/common/hooks/useIsDesktop';
import { Cart } from '@medusajs/medusa';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CartContent from './cart-content';

const CartDropdown = ({
	cart: cartState,
}: {
	cart?: Omit<Cart, 'beforeInsert' | 'afterLoad'> | null;
}) => {
	const isDesktop = useIsDesktop();
	const router = useRouter();

	const totalItems =
		cartState?.items?.reduce((acc, item) => {
			return acc + item.quantity;
		}, 0) || 0;

	const cartContent = <CartContent cart={cartState} />;

	const handleClick = () => {
		router.push('/cart');
	};

	const CartButton = (
		<BadgeButton
			icon={<ShoppingCart className="stroke-2" />}
			count={totalItems}
			showZero
			offset={[0, 10]}
			onClick={handleClick}
		/>
	);

	if (!isDesktop) {
		return CartButton;
	}

	return (
		<Dropdown
			dropdownRender={() => cartContent}
			overlayStyle={{
				backgroundColor: 'white',
				borderRadius: '8px',
				boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
			}}
			trigger={['click', 'hover']}
		>
			{CartButton}
		</Dropdown>
	);
};

export default CartDropdown;
