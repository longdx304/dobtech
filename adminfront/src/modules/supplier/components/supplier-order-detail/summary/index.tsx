import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import { DisplayTotal } from '@/modules/supplier/common';
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
	refetch?: () => void;
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
						currencyCode={'vnd'}
						reservations={reservationItemsMap[item.id]}
						isAllocatable={isAllocatable}
						paymentStt={supplierOrder?.payment_status}
						refetch={refetch}
					/>
				))}
				<Divider className="my-2" />
				{/* <DisplayTotal
					currency={'vnd'}
					totalAmount={1000}
					totalTitle={'Tạm tính'}
				/>

				<DisplayTotal
					currency={'vnd'}
					totalAmount={0}
					totalTitle={'Vận chuyển'}
				/>
				<DisplayTotal
					currency={'vnd'}
					totalAmount={0}
					totalTitle={'Thuế'}
				/>
				<DisplayTotal
					variant={'large'}
					currency={'vnd'}
					totalAmount={1000}
					totalTitle={'Tổng cộng'}
				/> */}
			</div>
		</Card>
	);
};

export default Summary;
