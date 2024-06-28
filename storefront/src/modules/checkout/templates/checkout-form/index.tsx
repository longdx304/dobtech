import { useCart } from '@/lib/providers/cart/cart-provider';
import Addresses from '../../components/addresses';
import { useCustomer } from '@/lib/providers/user/user-provider';
import { Card } from '@/components/Card';

export default function CheckoutForm() {
	const { cart } = useCart();
	const { customer } = useCustomer();

	return (
		<div>
			<Card>
				<Addresses cart={cart} customer={customer} />
			</Card>
		</div>
	);
}
