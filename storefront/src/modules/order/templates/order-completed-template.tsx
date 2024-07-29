'use client';

import { Text } from '@/components/Typography';
import CartTotals, { CartType } from '@/modules/common/components/cart-totals';
import { Order } from '@medusajs/medusa';
import React from 'react';
import Items from '../components/items';
import OrderDetails from '../components/order-details';
import PaymentDetails from '../components/payment-details';
import ShippingDetails from '../components/shipping-details';

type OrderCompletedTemplateProps = {
	order: Order;
};

const OrderCompletedTemplate: React.FC<OrderCompletedTemplateProps> = ({
	order,
}) => {
	return (
		<div className="pt-4 container box-border flex flex-col gap-8">
			<div className="py-6 min-h-[calc(100vh-64px)]">
				<div className="flex flex-col justify-center items-center gap-y-10 h-full w-full">
					<div
						className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
						data-testid="order-complete-container"
					>
						<Text className="flex flex-col gap-y-3 text-3xl mb-4 font-semibold">
							<span>Thank you!</span>
							<span>Đơn hàng của bạn đã được thanh toán thành công</span>
						</Text>
						<OrderDetails order={order} />
						<Text className="flex flex-row text-3xl font-semibold">
							Đơn hàng
						</Text>
						<Items items={order.items} region={order.region} />
						<CartTotals data={order} type={CartType.ORDER} />
						<ShippingDetails order={order} />
						<PaymentDetails order={order} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderCompletedTemplate;
