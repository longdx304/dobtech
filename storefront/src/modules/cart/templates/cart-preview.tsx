'use client';

import { useCart } from '@/lib/providers/cart/cart-provider';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Customer } from '@medusajs/medusa';
import { useEffect } from 'react';
import StepsOrder from '../components/steps-order';
import Overview from './overview';

type Props = {
	cart: CartWithCheckoutStep;
	customer: Omit<Customer, 'password_hash'> | null;
};
const CartPreview = ({ cart, customer }: Props) => {
	const { currentStep, refreshCart, setCurrentStep, allCarts } = useCart();

	useEffect(() => {
		setCurrentStep(0);
		refreshCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{currentStep === 0 && (
				<Overview cart={cart} customer={customer} className="pb-12" />
			)}
		</>
	);
};

export default CartPreview;
