'use client';
import { Button, SubmitButton } from '@/components/Button';
import { Text } from '@/components/Typography';
import { Cart, Customer } from '@medusajs/medusa';
import { Form } from 'antd';
import { CheckCircle, Loader2 } from 'lucide-react';
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from 'next/navigation';
import ShippingAddress from '../shipping-address';

const Addresses = ({
	cart,
	customer,
}: {
	cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
	customer: Omit<Customer, 'password_hash'> | null;
}) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();
	const [form] = Form.useForm();

	const countryCode = 'vn';

	const isOpen = searchParams.get('step') === 'address';

	const handleEdit = () => {
		router.push(pathname + '?step=address');
	};

	console.log('isOpen', isOpen);

	return (
		<div className="bg-white">
			<div className="flex flex-row items-center justify-between mb-6">
				<Text className="flex flex-row text-lg gap-x-2 items-baseline">
					Shipping Address
					{!isOpen && <CheckCircle />}
				</Text>
				{!isOpen && cart?.shipping_address && (
					<Text>
						<Button
							onClick={handleEdit}
							data-testid="edit-address-button"
						>
							Edit
						</Button>
					</Text>
				)}
			</div>
			{isOpen && (
				<Form form={form}>
					<div className="pb-8">
						<ShippingAddress
							customer={customer}
							countryCode={countryCode}
							cart={cart}
						/>

						<SubmitButton className="mt-6" data-testid="submit-address-button">
							Continue to delivery
						</SubmitButton>
					</div>
				</Form>
			)}
		</div>
	);
};

export default Addresses;