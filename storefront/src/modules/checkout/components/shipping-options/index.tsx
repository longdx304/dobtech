import { Card } from '@/components/Card';
import { useShippingOptions } from 'medusa-react';
import { Radio, RadioGroup } from '@/components/Radio';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { formatAmount } from '@/lib/utils/prices';
import { Region } from '@medusajs/medusa';
import { useState } from 'react';

type Props = {
	region: string;
};

const ShippingOptions = ({ region }: Props) => {
	const { shipping_options, isLoading } = useShippingOptions({
		region_id: region.id,
	});

	const [value, setValue] = useState<string>("");

	const getAmount = (amount: number | null | undefined) => {
		return formatAmount({
			amount: amount || 0,
			region: region,
			includeTaxes: false,
		});
	};

	const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

	return (
		<Card isLoading={isLoading}>
			<Text className="text-xl" strong>
					Tuỳ chọn giao hàng
			</Text>
			<RadioGroup className="w-full flex flex-col justify-start gap-4 pt-4" value={value}	onChange={onChange}>
				{shipping_options?.map((option) => (
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
							<Text className="text-xs" strong>
								{getAmount(option.amount)}
							</Text>
						</Flex>
					</Radio>
				))}
			</RadioGroup>
		</Card>
	);
};

export default ShippingOptions;
