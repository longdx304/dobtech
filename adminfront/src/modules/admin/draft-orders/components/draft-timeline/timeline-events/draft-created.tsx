import { DraftTimelineEvent } from '../../../hooks/use-build-draft-timeline';
import EventContainer, { EventIconColor } from '../../../../orders/components/orders/timeline/timeline-events/event-container';
import { FilePlus } from 'lucide-react';

type Props = {
	event: DraftTimelineEvent;
};

const DraftCreated = ({ event }: Props) => {
	return (
		<EventContainer
			title="Đơn nháp được tạo"
			time={event.time}
			icon={<FilePlus size={18} />}
			iconColor={EventIconColor.GREEN}
			isFirst={event.first}
		/>
	);
};

export default DraftCreated;