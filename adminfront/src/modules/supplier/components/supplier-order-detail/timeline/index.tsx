import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Input } from '@/components/Input';
import { Title } from '@/components/Typography';
import { getErrorMessage } from '@/lib/utils';
import {
	ItemsShippedEvent,
	OrderEditEvent,
	OrderEditRequestedEvent,
	OrderPlacedEvent,
	PaymentRequiredEvent,
	TimelineEvent,
} from '@/modules/orders/hooks/use-build-timeline';
import { useAdminSupplierOrder } from '@/modules/supplier/hooks';
import {
	NoteEvent,
	PaidEvent,
	RefundEvent,
} from '@/modules/supplier/hooks/use-build-timeline';
import { SupplierOrder } from '@/types/supplier';
import { Region } from '@medusajs/medusa';
import { Empty, message } from 'antd';
import { SendHorizontal } from 'lucide-react';
import { useAdminCreateNote } from 'medusa-react';
import { ChangeEvent, useState } from 'react';
import ItemsShipped from './timeline-events/items-shipped';
import Note from './timeline-events/note';
import OrderCanceled from './timeline-events/order-canceled';
import EditCanceled from './timeline-events/order-edit/canceled';
import ChangedPrice from './timeline-events/order-edit/changed-price';
import EditConfirmed from './timeline-events/order-edit/confirmed';
import EditCreated from './timeline-events/order-edit/created';
import EditDeclined from './timeline-events/order-edit/declined';
import PaymentRequired from './timeline-events/order-edit/payment-required';
import EditRequested from './timeline-events/order-edit/requested';
import OrderPlaced from './timeline-events/order-placed';
import Refund from './timeline-events/refund';
import Paid from './timeline-events/paid';

type Props = {
	orderId: SupplierOrder['id'] | undefined;
	isLoading: boolean;
	refetchOrder: () => void;
	events: TimelineEvent[] | undefined;
	refetch: () => void;
};

const Timeline = ({ orderId, isLoading, events }: Props) => {
	const createNote = useAdminCreateNote();
	const [inputValue, setInputValue] = useState<string>('');

	const { data: order, isLoading: isOrderLoading } = useAdminSupplierOrder(
		orderId!
	);

	if (!events?.length) {
		return (
			<Card loading={isLoading || isOrderLoading}>
				<Empty description="Chưa có sự kiện nào xảy ra" />
			</Card>
		);
	}

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { value: inputValue } = e.target;

		setInputValue(inputValue);
	};

	const onSubmit = () => {
		if (!inputValue) {
			return;
		}
		createNote.mutate(
			{
				resource_id: orderId!,
				resource_type: 'supplier_order',
				value: inputValue,
			},
			{
				onSuccess: () => {
					message.success('Ghi chú đã được tạo');
				},
				onError: (err) => message.error(getErrorMessage(err)),
			}
		);
		setInputValue('');
	};

	return (
		<Card
			loading={isLoading || isOrderLoading}
			className="px-4 max-h-[calc(100vh-80px)] overflow-y-auto sticky top-[20px]"
		>
			<div>
				<Flex align="center" justify="space-between" className="pb-4">
					<Title level={4}>{`Dòng thời gian`}</Title>
					<div className="flex justify-end items-center gap-4">
						{/* <ActionAbles actions={actions} /> */}
					</div>
				</Flex>
				<Flex
					align="center"
					justify="space-between"
					className="pb-4 w-full border-solid border-0 border-b border-gray-200"
					gap={4}
				>
					<Input
						value={inputValue}
						onChange={onChangeInput}
						placeholder="Nhập ghi chú"
						className="w-full"
					/>
					<Button
						className="h-[40px]"
						type="default"
						icon={<SendHorizontal size={16} />}
						onClick={onSubmit}
					/>
				</Flex>
				<div className="flex flex-col text-xs pt-4">
					{events?.map((event, i) => {
						return <div key={i}>{switchOnType(event, order?.region)}</div>;
					})}
				</div>
			</div>
		</Card>
	);
};

export default Timeline;

function switchOnType(event: TimelineEvent, region: Region | undefined) {
	switch (event.type) {
		case 'refund':
			return <Refund event={event as RefundEvent} />;
		case 'placed':
			return <OrderPlaced event={event as OrderPlacedEvent} />;
		case 'note':
			return <Note event={event as NoteEvent} />;
		case 'shipped':
			return <ItemsShipped event={event as ItemsShippedEvent} />;
		case 'canceled':
			return <OrderCanceled event={event as TimelineEvent} />;
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
		case 'payment-required':
			return <PaymentRequired event={event as PaymentRequiredEvent} />;
		case 'change-price':
			return <ChangedPrice event={event as any} region={region} />;
		case 'paid':
			return <Paid event={event as PaidEvent} />;
		default:
			return null;
	}
}
