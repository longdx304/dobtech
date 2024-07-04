'use client';

import { useCart } from '@/lib/providers/cart/cart-provider';
import CheckoutTemplate from '@/modules/checkout/templates';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Customer } from '@medusajs/medusa';
import StepsOrder from '../components/steps-order';
import Overview from './overview';

type Props = {
	cart: CartWithCheckoutStep;
	customer: Omit<Customer, 'password_hash'> | null;
};
const CartPreview = ({ cart, customer }: Props) => {
	const { currentStep } = useCart();

	return (
		<>
			{currentStep > 0 && <StepsOrder currentStep={currentStep} />}
			{/* {currentStep === 0 ? (
				<Overview cart={cart} customer={customer} className="pb-12" />
			) : (
				<CheckoutTemplate />
			)} */}
			{currentStep === 0 && (
				<Overview cart={cart} customer={customer} className="pb-12" />
			)}
		</>
	);
};

export default CartPreview;
