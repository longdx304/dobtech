import { useState } from 'react';
import { Card } from '@/components/Card';
import { ActionAbles } from '@/components/Dropdown';
import { Flex } from '@/components/Flex';
import { Title } from '@/components/Typography';
import {
	ItemsFulfilledEvent,
	ItemsShippedEvent,
	OrderPlacedEvent,
	RefundEvent,
	TimelineEvent,
	useBuildTimeline,
	PaymentRequiredEvent,
	RefundRequiredEvent,
	OrderEditEvent,
	OrderEditRequestedEvent,
	ReturnEvent,
	ExchangeEvent,
	ClaimEvent,
} from '@/modules/orders/hooks/use-build-timeline';
import { Order } from '@medusajs/medusa';
import { Empty } from 'antd';
import { CircleAlert, RefreshCcw, RotateCcw } from 'lucide-react';
import { useAdminOrder } from 'medusa-react';
import useOrdersExpandParam from '../utils/use-admin-expand-parameter';
import ItemsFulfilled from './timeline-events/items-fulfilled';
import ItemsShipped from './timeline-events/items-shipped';
import OrderCanceled from './timeline-events/order-canceled';
import OrderPlaced from './timeline-events/order-placed';
import Refund from './timeline-events/refund';
import Return from './timeline-events/return';
import Exchange from './timeline-events/exchange';
import Claim from './timeline-events/claim';
import PaymentRequired from './timeline-events/order-edit/payment-required';
import RefundRequired from './timeline-events/order-edit/refund-required';
import EditCreated from './timeline-events/order-edit/created';
import EditConfirmed from './timeline-events/order-edit/confirmed';
import EditCanceled from './timeline-events/order-edit/canceled';
import EditDeclined from './timeline-events/order-edit/declined';
import EditRequested from './timeline-events/order-edit/requested';
import ReturnMenu from './timeline-events/modal/returns';
import SwapModal from './timeline-events/modal/swap';
import ClaimModal from './timeline-events/modal/claim';

type Props = {
	orderId: Order['id'] | undefined;
	isLoading: boolean;
};

const Timeline = ({ orderId, isLoading }: Props) => {
	const { orderRelations } = useOrdersExpandParam();
	const { events, refetch } = useBuildTimeline(orderId!);
	const [showRequestReturn, setShowRequestReturn] = useState<boolean>(false);
	const [showCreateSwap, setShowCreateSwap] = useState<boolean>(false);
	const [showRegisterClaim, setShowRegisterClaim] = useState<boolean>(false);
	// const createNote = useAdminCreateNote();
	const { order, isLoading: isOrderLoading } = useAdminOrder(orderId!, {
		expand: orderRelations,
	});

	const actions = [
		{
			label: <span className="w-full">{'Yêu cầu trả hàng'}</span>,
			key: 'require_return',
			icon: <RotateCcw />,
			onClick: () => setShowRequestReturn(true),
		},
		{
			label: <span className="w-full">{'Đăng ký trao đổi'}</span>,
			key: 'exchange',
			icon: <RefreshCcw />,
			onClick: () => setShowCreateSwap(true),
		},
		{
			label: <span className="w-full">{'Đăng ký đòi hỏi'}</span>,
			key: 'claim',
			icon: <CircleAlert />,
			onClick: () => setShowRegisterClaim(true),
		},
	];

	if (!events?.length) {
		return (
			<Card loading={isLoading || isOrderLoading}>
				<Empty description="Chưa có sự kiện nào xảy ra" />
			</Card>
		);
	}

	return (
		<Card loading={isLoading || isOrderLoading} className="px-4">
			<div>
				<Flex align="center" justify="space-between" className="pb-4">
					<Title level={4}>{`Dòng thời gian`}</Title>
					<div className="flex justify-end items-center gap-4">
						<ActionAbles actions={actions} />
					</div>
				</Flex>
				<div className="flex flex-col text-xs">
					{events?.map((event, i) => {
						return <div key={i}>{switchOnType(event, refetch)}</div>;
					})}
				</div>
			</div>
			{showRequestReturn && order && (
				<ReturnMenu
					order={order}
					state={showRequestReturn}
					onClose={() => setShowRequestReturn(false)}
				/>
			)}
			{showCreateSwap && order && (
				<SwapModal
					order={order}
					state={showCreateSwap}
					onClose={() => setShowCreateSwap(false)}
				/>
			)}
			{showRegisterClaim && order && (
				<ClaimModal
					order={order}
					state={showRegisterClaim}
					onClose={() => setShowRegisterClaim(false)}
				/>
			)}
		</Card>
	);
};

export default Timeline;

function switchOnType(event: TimelineEvent, refetch: () => void) {
	switch (event.type) {
		case 'placed':
			return <OrderPlaced event={event as OrderPlacedEvent} />;
		case 'fulfilled':
			return <ItemsFulfilled event={event as ItemsFulfilledEvent} />;
		// case "note":
		//   return <Note event={event as NoteEvent} />
		case 'shipped':
			return <ItemsShipped event={event as ItemsShippedEvent} />;
		case 'canceled':
			return <OrderCanceled event={event as TimelineEvent} />;
		case 'return':
			return <Return event={event as ReturnEvent} refetch={refetch} />;
		case 'exchange':
			return (
				<Exchange
					key={event.id}
					event={event as ExchangeEvent}
					refetch={refetch}
				/>
			);
		case 'claim':
			return <Claim event={event as ClaimEvent} refetch={refetch} />;
		// case "notification":
		//   return <Notification event={event as NotificationEvent} />
		case 'refund':
			return <Refund event={event as RefundEvent} />;
		case 'edit-created':
			return <EditCreated event={event as OrderEditEvent} />;
		case 'edit-canceled':
			return <EditCanceled event={event as OrderEditEvent} />;
		case 'edit-declined':
			return <EditDeclined event={event as OrderEditEvent} />;
		case 'edit-confirmed':
			return <EditConfirmed event={event as OrderEditEvent} />;
		case 'edit-requested':
			return <EditRequested event={event as OrderEditRequestedEvent} />;
		case 'refund-required':
			return <RefundRequired event={event as RefundRequiredEvent} />;
		case 'payment-required':
			return <PaymentRequired event={event as PaymentRequiredEvent} />;
		default:
			return null;
	}
}
