'use client';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Radio, RadioGroup } from '@/components/Radio';
import { Text } from '@/components/Typography';
import { formatAmount } from '@/lib/utils/prices';
import { Region } from '@medusajs/medusa';
import { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
import { RadioChangeEvent } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { setShippingMethod } from '../../actions';
import { Loader } from 'lucide-react';

type Props = {
	region: Region;
	availableShippingMethods: PricedShippingOption[] | null;
};

const ShippingOptions = ({ region, availableShippingMethods }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [value, setValue] = useState<string>('');
	const cartId = useSearchParams().get('cartId') || '';

	const getAmount = (amount: number | null | undefined) => {
		return formatAmount({
			amount: amount || 0,
			region: region,
			includeTaxes: false,
		});
	};

	const set = useCallback(
		async (id: string) => {
			setIsLoading(true);
			try {
				await setShippingMethod(id, cartId);
			} catch (err) {
				console.error('Error setting shipping method:', err);
			} finally {
				setIsLoading(false);
			}
		},
		[cartId]
	);

	useEffect(() => {
		if (
			availableShippingMethods &&
			availableShippingMethods.length > 0 &&
			!value
		) {
			const defaultMethodId = availableShippingMethods[0].id;
			setValue(defaultMethodId as string);
			set(defaultMethodId as string);
		}
	}, [availableShippingMethods, value, set]);

	const onChange = (e: RadioChangeEvent) => {
		const newValue = e.target.value;
		if (newValue !== value) {
			setValue(newValue);
			set(newValue);
		}
	};

	return (
		<Card>
			<Text className="text-xl" strong>
				Tuỳ chọn giao hàng
			</Text>
			<RadioGroup
				className="w-full flex flex-col justify-start gap-4 pt-4"
				value={value}
				onChange={onChange}
			>
				{availableShippingMethods?.map((option) => (
					<Radio
						key={option.id}
						value={option.id}
						className="border border-solid border-gray-200 rounded-md px-4 py-2"
					>
						<Flex vertical justify="flex-start" align="flex-start" gap={2}>
							<Flex justify="flex-start" align="center" gap={4}>
								<Text className="text-[13px]" strong>
									{option.name}
								</Text>
								{option?.amount === 0 && (
									<Text className="text-xs text-green-800 bg-green-50 px-2 py-[2px]">
										{'Miễn phí vận chuyển'}
									</Text>
								)}
							</Flex>
							{isLoading ? (
								<Loader className="animate-spin" size={12} />
							) : (
								<Text className="text-xs" strong>
									{getAmount(option.amount)}
								</Text>
							)}
						</Flex>
					</Radio>
				))}
			</RadioGroup>
		</Card>
	);
};

export default ShippingOptions;
