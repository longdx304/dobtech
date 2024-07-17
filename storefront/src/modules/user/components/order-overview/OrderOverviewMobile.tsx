'use client';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import { Order } from '@medusajs/medusa';
import OrderCard from '../order-card';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ERoutes } from '@/types/routes';

const OrderOverviewMobile = ({ orders }: { orders: Order[] }) => {
	const router = useRouter();
	
	if (orders?.length) {
		return (
			<Flex
				justify="space-between"
				className="flex-col min-h-[98vh] bg-[#f6f6f6]"
			>
				<div className="user-order">
					<Flex
						align="center"
						justify="space-between"
						style={{ borderBottom: '11px solid #f6f6f6' }}
						className="pb-2 bg-white"
					>
						<div className="flex" onClick={() => router.push(`/${ERoutes.USER_SETTING}`)}>
							<ChevronLeft size={24} className="text-[#767676] pl-[12px]" />
						</div>
						<Text className="font-bold text-center">Đơn hàng của tôi</Text>
						<div className="w-[36px]" />
					</Flex>

					<Flex
						className="flex-col"
						style={{ borderBottom: '11px solid #f6f6f6' }}
					>
						{orders.map((o) => (
							<Flex key={o.id} className="px-4 py-4 bg-white mb-2 flex-col">
								<OrderCard order={o} />
							</Flex>
						))}
					</Flex>
				</div>
			</Flex>
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

export default OrderOverviewMobile;
