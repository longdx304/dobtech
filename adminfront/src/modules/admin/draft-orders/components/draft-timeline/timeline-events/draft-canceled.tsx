import { DraftTimelineEvent } from '../../../hooks/use-build-draft-timeline';
import EventContainer, { EventIconColor } from '../../../../orders/components/orders/timeline/timeline-events/event-container';
import { XCircle } from 'lucide-react';

type Props = {
	event: DraftTimelineEvent;
};

const DraftCanceled = ({ event }: Props) => {
	return (
		<EventContainer
			title="Đơn nháp đã bị hủy"
			time={event.time}
			icon={<XCircle size={18} />}
			iconColor={EventIconColor.RED}
			isFirst={event.first}
		/>
	);
};

export default DraftCanceled;