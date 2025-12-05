import { DraftTimelineEvent } from '../../../hooks/use-build-draft-timeline';
import EventContainer, { EventIconColor } from '../../../../orders/components/orders/timeline/timeline-events/event-container';
import { CheckCircle } from 'lucide-react';

type Props = {
	event: DraftTimelineEvent;
};

const DraftCompleted = ({ event }: Props) => {
	return (
		<EventContainer
			title="Đơn nháp đã hoàn thành"
			time={event.time}
			icon={<CheckCircle size={18} />}
			iconColor={EventIconColor.GREEN}
			isFirst={event.first}
		/>
	);
};

export default DraftCompleted;