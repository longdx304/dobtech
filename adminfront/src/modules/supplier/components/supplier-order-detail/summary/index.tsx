import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { ReservationItemDTO } from '@medusajs/types';
import { Divider, Empty } from 'antd';
import { Pencil } from 'lucide-react';
import { useGetCart } from 'medusa-react';
import { useMemo } from 'react';
import OrderLine from './order-line';
import { useSupplierOrderEdit } from '../edit-supplier-order-modal/context';
import { DisplayTotal } from '@/modules/supplier/common';

type Props = {
	order: any | undefined;
	isLoading: boolean;
	reservations: ReservationItemDTO[];
	refetch?: () => void;
};

const Summary = ({ order, isLoading, reservations = [], refetch }: Props) => {
	const { showModal } = useSupplierOrderEdit();

	const { cart, refetch: refetchCart } = useGetCart(order?.cart?.id ?? null);

	const reservationItemsMap = useMemo(() => {
		if (!reservations?.length) {
			return {};
		}

		return reservations.reduce(
			(acc: Record<string, ReservationItemDTO[]>, item: ReservationItemDTO) => {
				if (!item.line_item_id) {
					return acc;
				}
				acc[item.line_item_id] = acc[item.line_item_id]
					? [...acc[item.line_item_id], item]
					: [item];
				return acc;
			},
			{}
		);
	}, [reservations]);

	const actions = useMemo(() => {
		const actionAbles = [];
		actionAbles.push({
			label: <span>{'Chỉnh sửa đơn hàng'}</span>,
			icon: <Pencil size={16} />,
			onClick: () => {
				showModal();
			},
		});
		// }
		return actionAbles;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!order) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có đơn hàng" />
			</Card>
		);
	}

	const isAllocatable = !['canceled', 'archived'].includes(order.status);

	return (
		<Card loading={isLoading} className="px-4">
			<div>
				<Flex align="center" justify="space-between" className="pb-2">
					<Title level={4}>{`Tổng quan`}</Title>
					<ActionAbles actions={actions as any} />
				</Flex>
			</div>
			<div>
				{cart?.items?.map((item: any, i: number) => (
					<OrderLine
						key={item.id}
						item={item}
						currencyCode={cart.region.currency_code}
						reservations={reservationItemsMap[item.id]}
						isAllocatable={isAllocatable}
						paymentStt={order.status}
						refetch={refetchCart}
					/>
				))}
				<Divider className="my-2" />
				<DisplayTotal
					currency={cart?.region.currency_code}
					totalAmount={cart?.subtotal}
					totalTitle={'Tạm tính'}
				/>

				<DisplayTotal
					currency={cart?.region.currency_code}
					totalAmount={cart?.shipping_total}
					totalTitle={'Vận chuyển'}
				/>
				<DisplayTotal
					currency={cart?.region.currency_code}
					totalAmount={cart?.tax_total}
					totalTitle={'Thuế'}
				/>
				<DisplayTotal
					variant={'large'}
					currency={cart?.region.currency_code}
					totalAmount={cart?.total}
					totalTitle={'Tổng cộng'}
				/>
			</div>
		</Card>
	);
};

export default Summary;
