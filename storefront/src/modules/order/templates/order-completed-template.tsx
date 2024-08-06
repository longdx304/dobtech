'use client';

import { Text } from '@/components/Typography';
import CartTotals, { CartType } from '@/modules/common/components/cart-totals';
import { Order } from '@medusajs/medusa';
import React from 'react';
import Items from '../components/items';
import OrderDetails from '../components/order-details';
import PaymentDetails from '../components/payment-details';
import ShippingDetails from '../components/shipping-details';
import { Flex } from '@/components/Flex';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';

type OrderCompletedTemplateProps = {
	order: Order;
};

const OrderCompletedTemplate: React.FC<OrderCompletedTemplateProps> = ({
	order,
}) => {
	const router = useRouter();
	return (
		<Flex className="pt-2 container box-border flex flex-col gap-8">
			<div className="pt-4 pb-6 min-h-[calc(100vh-64px)]">
				<Flex className="flex flex-col justify-center items-center gap-y-10 h-full w-full">
					<Flex
						className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full "
						data-testid="order-complete-container"
					>
						{/* Desktop */}
						<Flex
							align="center"
							justify="space-between"
							className="hidden lg:flex gap-y-3 text-2xl mb-4 font-semibold"
						>
							<Flex className="flex-col" gap={2}>
								<span>Xin cảm ơn bạn!</span>
								<span className="text-xl">
									Đơn hàng của bạn đã được thanh toán thành công
								</span>
							</Flex>
							<Button
								type="primary"
								size="middle"
								onClick={() =>
									router.push(`/${ERoutes.USER_ORDERS}/details/${order.id}`)
								}
							>
								Xem đơn đặt hàng
							</Button>
						</Flex>

						{/* Mobile */}
						<div className="block lg:hidden">
							<Flex className="flex-col text-2xl font-semibold mb-2" gap={2}>
								<span>Xin cảm ơn bạn!</span>
								<span className="text-xl">
									Đơn hàng của bạn đã được thanh toán thành công
								</span>
							</Flex>
							<Button
								type="primary"
								size="middle"
								onClick={() =>
									router.push(`/${ERoutes.USER_ORDERS}/details/${order.id}`)
								}
								className='w-full'
							>
								Xem đơn đặt hàng
							</Button>
						</div>
						<OrderDetails order={order} />
						<Text className="flex flex-row text-3xl font-semibold">
							Đơn hàng
						</Text>
						<Items items={order.items} region={order.region} />
						<CartTotals data={order} type={CartType.ORDER} />
						<ShippingDetails order={order} />
						<PaymentDetails order={order} />
					</Flex>
				</Flex>
				
			</div>
		</Flex>
	);
};

export default OrderCompletedTemplate;
