'use client';

import { useCart } from '@/lib/providers/cart/cart-provider';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Customer } from '@medusajs/medusa';
import { Spin } from 'antd';
import { useEffect } from 'react';
import Overview from './overview';

type Props = {
	cart: CartWithCheckoutStep;
	customer: Omit<Customer, 'password_hash'> | null;
};
const CartPreview = ({ cart, customer }: Props) => {
	const { currentStep, refreshCart, setCurrentStep, isProcessing } = useCart();

	useEffect(() => {
		setCurrentStep(0);
		refreshCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Spin spinning={isProcessing} tip="Xin vui lòng đợi...">
			{currentStep === 0 && (
				<Overview cart={cart} customer={customer} className="pb-12" />
			)}
		</Spin>
	);
};

export default CartPreview;
