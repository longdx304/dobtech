import { TransferredToWarehouseEvent } from '@/modules/admin/orders/hooks/use-build-timeline';
import { Warehouse } from 'lucide-react';
import React from 'react';
import EventContainer, { EventIconColor } from './event-container';

type Props = {
	event: TransferredToWarehouseEvent;
};

const TransferredToWarehouse: React.FC<Props> = ({ event }) => {
	const args = {
		icon: <Warehouse size={20} />,
		iconColor: EventIconColor.DEFAULT,
		time: event.time,
		title: 'Chuyển sang kho',
		detail: `Thực hiện bởi: ${event.transferredByName}`,
		isFirst: event.first,
	};
	return <EventContainer {...args} />;
};

export default TransferredToWarehouse;
