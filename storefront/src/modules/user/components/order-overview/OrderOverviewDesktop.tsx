'use client';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { Order } from '@medusajs/medusa';
import OrderCard from '../order-card';

const OrderOverviewDesktop = ({ orders }: { orders: Order[] }) => {
	if (orders?.length) {
		return (
			<>
				<Flex className="mb-4 flex-col gap-y-4">
					<Title level={2} className="text-2xl">
						Đơn hàng của bạn
					</Title>
					<Text className="text-base">
						Xem các đơn đặt hàng trước đó của bạn và trạng thái đơn hàng của
						bạn. Bạn cũng có thể tạo trả lại hoặc trao đổi đơn đặt hàng của bạn
						nếu cần thiết.
					</Text>
				</Flex>
				<Flex className="flex-col gap-y-8 w-full">
					{orders.map((o) => (
						<div
							key={o.id}
							className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
						>
							<OrderCard order={o} />
						</div>
					))}
				</Flex>
			</>
		);
	}

	return (
		<Flex
			className="w-full flex-col gap-y-4"
			data-testid="no-orders-container"
			align="center"
		>
			<Title level={2}>Không có gì để xem ở đây</Title>
			<Text className="text-base">
				Bạn chưa có đơn hàng nào, hãy tiếp tục mua sắm {':)'}
			</Text>
			<div className="mt-4">
				<LocalizedClientLink href="/" passHref>
					<Button data-testid="continue-shopping-button">
						Tiếp tục mua sắm
					</Button>
				</LocalizedClientLink>
			</div>
		</Flex>
	);
};

export default OrderOverviewDesktop;
