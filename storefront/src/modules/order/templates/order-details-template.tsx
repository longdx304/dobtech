'use client';

import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { Order } from '@medusajs/medusa';
import { X } from 'lucide-react';
import React from 'react';
import Items from '../components/items';
import OrderDetails from '../components/order-details';
import OrderSummary from '../components/order-summary';
import ShippingDetails from '../components/shipping-details';

type OrderDetailsTemplateProps = {
	order: Order;
};

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
	order,
}) => {
	return (
		<Flex justify="center" className="flex-col gap-y-4 ">
			<Flex justify="space-between" align="center" className="gap-2">
				<Title level={2}>Chi tiết đơn hàng</Title>
				<LocalizedClientLink
					href="user/orders"
					className="flex gap-1 items-center text-[#4b5563] hover:text-[#030712]"
					data-testid="back-to-overview-button"
				>
					<X size={16} /> Quay lại
				</LocalizedClientLink>
			</Flex>
			<div
				className="flex flex-col gap-4 h-full bg-white w-full"
				data-testid="order-details-container"
			>
				<OrderDetails order={order} showStatus />
				<Items items={order.items} region={order.region} />
				<ShippingDetails order={order} />
				<OrderSummary order={order} />
			</div>
		</Flex>
	);
};

export default OrderDetailsTemplate;
