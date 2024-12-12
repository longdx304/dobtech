import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Text, Title } from '@/components/Typography';
import { DisplayTotal, DisplayTotalQuantity } from '@/modules/supplier/common';
import { SupplierOrder } from '@/types/supplier';
import { ReservationItemDTO } from '@medusajs/types';
import { Divider, Empty } from 'antd';
import { Pencil } from 'lucide-react';
import { useMemo } from 'react';
import { useSupplierOrderEdit } from '../edit-supplier-order-modal/context';
import OrderLine from './order-line';

type Props = {
	supplierOrder: SupplierOrder | undefined;
	isLoading: boolean;
	reservations: ReservationItemDTO[];
	refetch: () => void;
};

const Summary = ({
	supplierOrder,
	isLoading,
	reservations = [],
	refetch,
}: Props) => {
	const { showModal } = useSupplierOrderEdit();

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

	if (!supplierOrder) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có đơn hàng" />
			</Card>
		);
	}

	const isAllocatable = !['canceled', 'archived'].includes(
		supplierOrder.status
	);

	const totalQuantity = supplierOrder.items.reduce(
		(acc, item) => acc + item.quantity,
		0
	);
	return (
		<Card loading={isLoading} className="px-4">
			<div>
				<Flex align="center" justify="space-between" className="pb-2">
					<Title level={4}>{`Tổng quan`}</Title>
					<ActionAbles actions={actions as any} />
				</Flex>
			</div>
			<div>
				{supplierOrder?.items?.map((item: any, i: number) => (
					<OrderLine
						key={item.id}
						item={item}
						currencyCode={supplierOrder.currency_code}
						reservations={reservationItemsMap[item.id]}
						isAllocatable={isAllocatable}
						paymentStt={supplierOrder?.payment_status}
						refetch={refetch}
					/>
				))}
				<Divider className="my-2" />
				<DisplayTotalQuantity
					totalAmount={totalQuantity}
					totalTitle={'Tổng số lượng'}
				/>
				<DisplayTotal
					currency={supplierOrder.currency_code}
					totalAmount={supplierOrder.subtotal}
					totalTitle={'Tạm tính'}
				/>

				<DisplayTotal
					currency={supplierOrder.currency_code}
					totalAmount={supplierOrder.tax_total}
					totalTitle={'Thuế'}
				/>
				<DisplayTotal
					variant={'large'}
					currency={supplierOrder.currency_code}
					totalAmount={supplierOrder.total}
					totalTitle={'Tổng cộng'}
				/>
			</div>
		</Card>
	);
};

export default Summary;
