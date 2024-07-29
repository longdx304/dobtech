import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { Order } from '@medusajs/medusa';

type OrderDetailsProps = {
	order: Order;
	showStatus?: boolean;
};

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
	const formatStatus = (str: string) => {
		const formatted = str.split('_').join(' ');

		return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
	};

	return (
		<Flex className="flex-col gap-y-4">
			<Text>
				Chúng tôi đã gửi chi tiết xác nhận đơn hàng tới email của bạn:{' '}
				<span className="font-semibold" data-testid="order-email">
					{order.email}.
				</span>
			</Text>
			<Text>
				Ngày thanh toán:{' '}
				<span data-testid="order-date">
					{new Date(order.created_at).toDateString()}
				</span>
			</Text>
			{/* <Text>
				Đơn hàng số: <span data-testid="order-id">{order.display_id}</span>
			</Text> */}

			{showStatus && (
				<Flex className="flex-col gap-y-2">
					<Text>
						Trang thái đơn hàng:{' '}
						<span className="" data-testid="order-status">
							{formatStatus(order.fulfillment_status)}
						</span>
					</Text>
					<Text>
						Trang thái thanh toán: <span>{formatStatus(order.payment_status)}</span>
					</Text>
				</Flex>
			)}
		</Flex>
	);
};

export default OrderDetails;
