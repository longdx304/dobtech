import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { formatAmount } from '@/lib/utils/prices';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import Thumbnail from '@/modules/products/components/thumbnail';
import { Order } from '@medusajs/medusa';
import { useMemo } from 'react';
import dayjs from 'dayjs';

type OrderCardProps = {
	order: Omit<Order, 'beforeInsert'>;
};

const OrderCard = ({ order }: OrderCardProps) => {
	const numberOfLines = useMemo(() => {
		return order.items.reduce((acc, item) => {
			return acc + item.quantity;
		}, 0);
	}, [order]);

	const numberOfProducts = useMemo(() => {
		return order.items.length;
	}, [order]);

	return (
		<Flex className="bg-white flex-col" data-testid="order-card">
			<Flex
				align="center"
				className="flex divide-x divide-solid divide-y-0 divide-gray-200"
			>
				<Text className="pr-2" data-testid="order-created-at">
					{dayjs(order.created_at).format('DD/MM/YYYY')}
				</Text>
				<Text className="px-2" data-testid="order-amount">
					{formatAmount({
						amount: order.total,
						region: order.region,
						includeTaxes: false,
					})}
				</Text>
				<Text className="pl-2">{`${numberOfLines} ${
					numberOfLines > 1 ? 'items' : 'item'
				}`}</Text>
			</Flex>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4">
				{order.items.slice(0, 3).map((i) => {
					return (
						<Flex
							key={i.id}
							className="flex-col gap-y-2"
							data-testid="order-item"
						>
							<Thumbnail thumbnail={i.thumbnail} size="full" />
							<Flex align="center">
								<Text className="font-semibold" data-testid="item-title">
									{i.title}
								</Text>
								<Text className="ml-2">x</Text>
								<Text data-testid="item-quantity">{i.quantity}</Text>
							</Flex>
						</Flex>
					);
				})}
				{numberOfProducts > 4 && (
					<Flex
						align="center"
						justify="center"
						className="w-full h-full flex flex-col"
					>
						<Text>+ {numberOfLines - 4}</Text>
						<Text>more</Text>
					</Flex>
				)}
			</div>
			<Flex className="justify-end">
				<LocalizedClientLink href={`user/orders/details/${order.id}`}>
					<Button
						data-testid="order-details-link"
						className="h-[32px] px-1 py-2 text-[12px] lg:h-[40px] lg:px-3 lg:py-4 lg:text-[16px]"
					>
						Xem chi tiết
					</Button>
				</LocalizedClientLink>
			</Flex>
		</Flex>
	);
};

export default OrderCard;
