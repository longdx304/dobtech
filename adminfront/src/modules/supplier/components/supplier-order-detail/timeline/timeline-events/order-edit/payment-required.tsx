import { useAdminOrderEdits } from 'medusa-react';
import React from 'react';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { PaymentRequiredEvent } from '@/modules/orders/hooks/use-build-timeline';
import { useAdminSupplierOrder } from '@/modules/supplier/hooks';
import { formatAmountWithSymbol } from '@/utils/prices';
import { CircleAlert } from 'lucide-react';
import EventContainer, { EventIconColor } from '../event-container';

type RequestedProps = {
	event: PaymentRequiredEvent;
};

const PaymentRequired: React.FC<RequestedProps> = ({ event }) => {
	const { order_edits: edits } = useAdminOrderEdits({
		order_id: event.orderId,
	});
	const { data: order } = useAdminSupplierOrder(event.orderId);

	if (!order || !edits) {
		return null;
	}

	// const amount = requestedEditDifferenceDue
	// 	? order.total - order.paid_total + requestedEditDifferenceDue
	// 	: order.refunded_total - order.paid_total;
	const amount = order.paid_total;

	if (amount <= 0) {
		return null;
	}

	const onCopyPaymentLinkClicked = () => {
		console.log('TODO');
	};

	const onMarkAsPaidClicked = () => {
		console.log('TODO');
	};

	return (
		<EventContainer
			title={'Yêu cầu khách hàng thanh toán'}
			icon={<CircleAlert size={20} />}
			iconColor={EventIconColor.VIOLET}
			time={event.time}
			isFirst={event.first}
			midNode={
				<span className="font-normal text-gray-500">
					{formatAmountWithSymbol({
						amount,
						currency: event.currency_code,
					})}
				</span>
			}
		>
			<Flex vertical gap="small">
				<Button
					size="small"
					type="default"
					className="font-medium"
					onClick={onCopyPaymentLinkClicked}
				>
					Sao chép liên kết thanh toán
				</Button>
				<Button
					size="small"
					type="default"
					className="font-medium"
					onClick={onMarkAsPaidClicked}
				>
					Đánh dấu là đã trả tiền
				</Button>
			</Flex>
		</EventContainer>
	);
};

export default PaymentRequired;
