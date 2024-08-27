'use client';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Radio, RadioGroup } from '@/components/Radio';
import { Text } from '@/components/Typography';
import { Cart, PaymentSession } from '@medusajs/medusa';
import { RadioChangeEvent } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { setPaymentMethod } from '../../actions';
import { Loader } from 'lucide-react';
import { paymentInfoMap } from '@/lib/constants';

type Props = {
	cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
};

const PaymentOptions = ({ cart }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [value, setValue] = useState<string>('');
	const cartId = useSearchParams().get('cartId') || '';

	const set = useCallback(
		async (providerId: string) => {
			setIsLoading(true);
			try {
				await setPaymentMethod(cartId, providerId);
			} catch (err) {
				console.error('Error setting payment method:', err);
			} finally {
				setIsLoading(false);
			}
		},
		[cartId]
	);

	useEffect(() => {
		if (cart?.payment_sessions && cart.payment_sessions.length > 0 && !value) {
			const defaultMethodId = cart.payment_sessions[0].provider_id;
			setValue(defaultMethodId);
			set(defaultMethodId);
		}
	}, [cart?.payment_sessions, value, set]);

	const onChange = (e: RadioChangeEvent) => {
		const newValue = e.target.value;
		if (newValue !== value) {
			setValue(newValue);
			set(newValue);
		}
	};

	return (
		<Suspense>
			<Card>
				<Text className="text-xl" strong>
					Phương thức thanh toán
				</Text>
				<RadioGroup
					className="w-full flex flex-col justify-start gap-4 pt-4"
					value={value}
					onChange={onChange}
				>
					{cart?.payment_sessions?.map((option: PaymentSession) => (
						<Radio
							key={option.id}
							value={option.provider_id}
							className="border border-solid border-gray-200 rounded-md px-4 py-2"
						>
							<Flex vertical justify="flex-start" align="flex-start" gap={2}>
								<Flex justify="flex-start" align="center" gap={4}>
									<Text className="text-[13px]" strong>
										{paymentInfoMap[option.provider_id]?.title ||
											option.provider_id}
									</Text>
								</Flex>
								{isLoading ? (
									<Loader className="animate-spin" size={12} />
								) : null}
							</Flex>
						</Radio>
					))}
				</RadioGroup>
			</Card>
		</Suspense>
	);
};

export default PaymentOptions;
