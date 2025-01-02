'use client';

import { useCart } from '@/lib/providers/cart/cart-provider';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Customer } from '@medusajs/medusa';
import { Spin } from 'antd';
import { useEffect, useCallback } from 'react';
import Overview from './overview';

type Props = {
	cart: CartWithCheckoutStep;
	customer: Omit<Customer, 'password_hash'> | null;
};

const CartPreview = ({ cart, customer }: Props) => {
	const {
		currentStep,
		refreshCart,
		setCurrentStep,
		isProcessing,
		refreshAllCarts,
	} = useCart();

	const initializeCart = useCallback(() => {
		setCurrentStep(0);
		// Only refresh if cart is empty or needs update
		if (!cart?.items?.length || !cart.payment_session) {
			refreshCart();
		}
	}, [cart?.items?.length, cart?.payment_session, refreshCart, setCurrentStep]);

	useEffect(() => {
		initializeCart();
	}, [initializeCart]);

	return (
		<Spin spinning={isProcessing} tip="Xin vui lòng đợi...">
			{currentStep === 0 && (
				<Overview cart={cart} customer={customer} className="pb-12" />
			)}
		</Spin>
	);
};

export default CartPreview;
