import { formatAmount } from '@/lib/utils/prices';
import { Order } from '@medusajs/medusa';

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
			<div>order sumary</div>
		</div>
	);
};

export default OrderSummary;
