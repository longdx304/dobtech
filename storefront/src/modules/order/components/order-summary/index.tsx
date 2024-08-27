import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { formatAmount } from '@/lib/utils/prices';
import { Order } from '@medusajs/medusa';
import { Divider } from 'antd';

type OrderSummaryProps = {
	order: Order;
};

const OrderSummary = ({ order }: OrderSummaryProps) => {
	const getAmount = (amount?: number | null) => {
		if (!amount) {
			return;
		}

		return formatAmount({ amount, region: order.region, includeTaxes: false });
	};

	return (
		<div>
			<Title level={2}>Tóm tắt đơn hàng</Title>
			<Flex className="flex-col my-2">
				<Flex className="mb-2" align="center" justify="space-between">
					<span>Thành tiền</span>
					<span>{getAmount(order.subtotal)}</span>
				</Flex>
				<Flex className="flex-col gap-y-1">
					{order.discount_total > 0 && (
						<Flex className="flex items-center justify-between">
							<span>Giảm giá</span>
							<span>- {getAmount(order.discount_total)}</span>
						</Flex>
					)}
					{order.gift_card_total > 0 && (
						<Flex className="flex items-center justify-between">
							<span>Phiếu quà tặng</span>
							<span>- {getAmount(order.gift_card_total)}</span>
						</Flex>
					)}
					<Flex className="flex items-center justify-between">
						<span>Giao hàng</span>
						<span>{getAmount(order.shipping_total)}</span>
					</Flex>
					<Flex className="flex items-center justify-between">
						<span>Thuế</span>
						<span>{getAmount(order.tax_total)}</span>
					</Flex>
				</Flex>
				<Divider className="my-4" />
				<Flex className="flex items-center justify-between mb-2">
					<span>Tổng cộng</span>
					<span>{getAmount(order.total)}</span>
				</Flex>
			</Flex>
		</div>
	);
};

export default OrderSummary;
