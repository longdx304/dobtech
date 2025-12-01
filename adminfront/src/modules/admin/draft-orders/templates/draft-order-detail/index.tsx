'use client';
import { Col, Row } from 'antd';
import { useAdminDraftOrder } from 'medusa-react';
import BackToDorders from '../../components/back-to-dorders';
import Information from '../../components/information';
import CustomerInfo from '../../components/customer-info';
import Summary from '../../components/summary';
import DraftTimeline from '../../components/draft-timeline';
import { useBuildDraftTimeline } from '../../hooks/use-build-draft-timeline';

interface Props {
	id: string;
}

export default function DraftOrderDetail({ id }: Readonly<Props>) {
	const { draft_order, isLoading, refetch } = useAdminDraftOrder(id);
	const {
		events,
		isLoading: isLoadingTimeline,
	} = useBuildDraftTimeline(draft_order, isLoading);

	return (
		<Row gutter={[16, 16]} className="mb-12">
			<Col span={24}>
				<BackToDorders />
			</Col>
			{draft_order?.id && (
				<Col xs={24} lg={14} className="flex flex-col gap-y-4">
					<Information dorder={draft_order} isLoading={isLoading} />
					<Summary dorder={draft_order} isLoading={isLoading} />
					<CustomerInfo dorder={draft_order} isLoading={isLoading} />
				</Col>
			)}
			<Col xs={24} lg={10}>
				{draft_order?.id && (
					<DraftTimeline
						draftOrderId={draft_order.id}
						isLoading={isLoading || isLoadingTimeline}
						events={events}
					/>
				)}
			</Col>
		</Row>
	);
}
