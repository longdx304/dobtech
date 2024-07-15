'use client';

import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { Order } from '@medusajs/medusa';
import { X } from 'lucide-react';
import React from 'react';
import Items from '../components/items';
import OrderDetails from '../components/order-details';
import OrderSummary from '../components/order-summary';
import ShippingDetails from '../components/shipping-details';

type OrderCompletedTemplateProps = {
	order: Order;
};

const OrderCompletedTemplate: React.FC<OrderCompletedTemplateProps> = ({
	order,
}) => {
	return (
		<div className="flex flex-col justify-center gap-y-4">
			<div className="flex gap-2 justify-between items-center">
				<h1 className="text-2xl-semi">Order details</h1>
				<LocalizedClientLink
					href="/account/orders"
					className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
					data-testid="back-to-overview-button"
				>
					<X /> Back to overview
				</LocalizedClientLink>
			</div>
			<div
				className="flex flex-col gap-4 h-full bg-white w-full"
				data-testid="order-details-container"
			>
				<OrderDetails order={order} showStatus />
				<Items items={order.items} region={order.region} />
				<ShippingDetails order={order} />
				<OrderSummary order={order} />
			</div>
		</div>
	);
};

export default OrderCompletedTemplate;
