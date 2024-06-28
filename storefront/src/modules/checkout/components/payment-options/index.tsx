import { Card } from '@/components/Card';
import { Radio, RadioGroup } from '@/components/Radio';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { formatAmount } from '@/lib/utils/prices';
import { Region } from '@medusajs/medusa';
import { HandCoins } from 'lucide-react';
import { useState } from 'react';

type Props = {
};

const PaymentOptions = ({ }: Props) => {
	const [value, setValue] = useState<string>("ship-cod");

	const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

	return (
		<Card>
			<Text className="text-xl" strong>
					Phương thức thanh toán
			</Text>
			<RadioGroup className="w-full flex flex-col justify-start gap-4 pt-4" value={value}	onChange={onChange}>
				<Radio
					className="border border-solid border-gray-200 rounded-md px-4 py-2"
				>
					<Flex justify="flex-start" align="center" gap={4}>
						<HandCoins className="text-gray-600" size={24} />
						<Text className="text-[13px]">Thanh toán khi nhận hàng</Text>
					</Flex>
				</Radio>
			</RadioGroup>
		</Card>
	);
};

export default PaymentOptions;
