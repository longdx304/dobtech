import { Card } from '@/components/Card';
import { Title } from '@/components/Typography';
import { DraftTimelineEvent } from '../../hooks/use-build-draft-timeline';
import { Empty } from 'antd';
import DraftCreated from './timeline-events/draft-created';
import DraftCompleted from './timeline-events/draft-completed';
import DraftCanceled from './timeline-events/draft-canceled';

type Props = {
	draftOrderId: string;
	isLoading: boolean;
	events: DraftTimelineEvent[] | undefined;
};

const DraftTimeline = ({ draftOrderId, isLoading, events }: Props) => {
	if (!events?.length) {
		return (
			<Card loading={isLoading}>
				<Empty description="Chưa có sự kiện nào xảy ra" />
			</Card>
		);
	}

	return (
		<Card loading={isLoading} className="px-4 max-h-[calc(100vh-80px)] overflow-y-auto sticky top-[20px]">
			<div>
				<div className="pb-4">
					<Title level={4}>{`Dòng thời gian`}</Title>
				</div>
				<div className="flex flex-col text-xs">
					{events?.map((event, i) => {
						return (
							<div key={i}>
								{switchOnType(event)}
							</div>
						);
					})}
				</div>
			</div>
		</Card>
	);
};

export default DraftTimeline;

function switchOnType(event: DraftTimelineEvent) {
	switch (event.type) {
		case 'created':
			return <DraftCreated event={event} />;
		case 'completed':
			return <DraftCompleted event={event} />;
		case 'canceled':
			return <DraftCanceled event={event} />;
		case 'note':
			// For now, we'll skip notes as they would require additional components
			return null;
		default:
			return null;
	}
}
