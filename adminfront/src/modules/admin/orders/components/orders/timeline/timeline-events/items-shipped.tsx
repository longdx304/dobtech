import React from 'react';
import { ItemsShippedEvent } from '@/modules/admin/orders/hooks/use-build-timeline';
import { Truck } from 'lucide-react';
import Image from '@/components/Image/Image';
import EventContainer from './event-container';
import EventItemContainer from './event-item-container';


type ItemsShippedProps = {
	event: ItemsShippedEvent;
};

const ItemsShipped: React.FC<ItemsShippedProps> = ({ event }) => {
	const title =
		event.sourceType === 'claim'
			? 'Các sản phẩm thay thế đã được vận chuyển'
			: event.sourceType === 'exchange'
			? 'Các sản phẩm trao đổi đã được vận chuyển'
			: 'Các sản phẩm đã được vận chuyển';

	const detail = event.locationName
		? `Shipped from ${event.locationName}`
		: undefined;

	const args = {
		icon: <Truck size={20} />,
		time: event.time,
		title: title,
		children: (
			<div className="space-y-2">
				{event.items.map((item, index) => (
					<EventItemContainer item={item} key={index} />
				))}
				{!!event.shippedUrls?.length && (
					<div className="flex flex-wrap gap-2 pt-1">
						{event.shippedUrls.map((url, index) => (
							<Image
								key={`${url}-${index}`}
								src={url}
								alt={`Ảnh giao hàng #${index + 1}`}
								width={72}
								height={72}
								className="h-[72px] w-[72px] rounded object-cover"
							/>
						))}
					</div>
				)}
			</div>
		),
		noNotification: event.noNotification,
		isFirst: event.first,
		detail,
	};
	return <EventContainer {...args} />;
};

export default ItemsShipped;
