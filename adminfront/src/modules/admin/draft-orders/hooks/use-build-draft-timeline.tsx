import { useMemo } from 'react';
import { useAdminNotes } from 'medusa-react';
import { DraftOrder } from '@medusajs/medusa';

export interface DraftTimelineEvent {
	id: string;
	time: Date;
	first?: boolean;
	draftOrderId: string;
	noNotification?: boolean;
	type:
	| 'note'
	| 'created'
	| 'updated'
	| 'completed'
	| 'canceled'
	| 'attachment'
	| 'status-change';
}

export interface DraftNoteEvent extends DraftTimelineEvent {
	value: string;
	authorId: string;
}

export interface DraftAttachmentEvent extends DraftTimelineEvent {
	url: string;
	fileName: string;
}


export const useBuildDraftTimeline = (draftOrder: DraftOrder | undefined, isLoading: boolean) => {
	const events: DraftTimelineEvent[] | undefined = useMemo(() => {
		if (!draftOrder) {
			return undefined;
		}

		if (isLoading) {
			return undefined;
		}

		const events: DraftTimelineEvent[] = [];

		// Initial creation event
		events.push({
			id: `${draftOrder.id}-created`,
			time: draftOrder.created_at,
			type: 'created',
			draftOrderId: draftOrder.id,
		});

		// Status change events
		if (draftOrder.status === 'completed') {
			events.push({
				id: `${draftOrder.id}-completed`,
				time: draftOrder.updated_at,
				type: 'completed',
				draftOrderId: draftOrder.id,
			});
		}

		// Sort events by time (newest first)
		events.sort((a, b) => {
			if (a.time > b.time) {
				return -1;
			}

			if (a.time < b.time) {
				return 1;
			}

			return 0;
		});

		// Mark the oldest event as first
		if (events.length > 0) {
			events[events.length - 1].first = true;
		}

		return events;
	}, [draftOrder, isLoading]);

	return {
		events,
		isLoading: isLoading,
	};
};
