import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import { paymentInfoMap } from '@/lib/constants';
import { formatAmount } from '@/lib/utils/prices';
import { Order } from '@medusajs/medusa';
import { Divider } from 'antd';

type PaymentDetailsProps = {
	order: Order;
};

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
	const payment = order.payments[0];

	return (
		<div>
			<Title level={2} className="flex flex-row text-3xl-regular mb-6">
				Thanh toán
			</Title>
			<div>
				{payment && (
					<div className="flex items-start gap-x-1 w-full">
						<div className="flex flex-col w-1/3 text-[14px]">
							<Text className="font-medium text-gray-900 mb-1">
								Phương thức thanh toán
							</Text>
							<Text className="text-gray-600" data-testid="payment-method">
								{paymentInfoMap[payment.provider_id].title}
							</Text>
						</div>
						<div className="flex flex-col w-2/3 text-[14px]">
							<Text className="font-medium text-gray-900 mb-1">
								Chi tiết thanh toán
							</Text>
							<div className="flex gap-2 text-gray-600 items-center">
								<Flex className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
									{paymentInfoMap[payment.provider_id].icon}
								</Flex>
								<Text data-testid="payment-amount">
									{payment.provider_id === 'stripe' && payment.data.card_last4
										? `**** **** **** ${payment.data.card_last4}`
										: `${formatAmount({
												amount: payment.amount,
												region: order.region,
												includeTaxes: false,
										  })} được thanh toán ngày ${new Date(
												payment.created_at
										  ).toString()}`}
								</Text>
							</div>
						</div>
					</div>
				)}
			</div>

			<Divider className="mt-8" />
		</div>
	);
};

export default PaymentDetails;
