'use client';
import { Row } from 'antd';
import { useAdminDraftOrder } from 'medusa-react';

interface Props {
	id: string;
}

export default function DraftOrderDetail({ id }: Readonly<Props>) {
	const { draft_order, isLoading, refetch } = useAdminDraftOrder(id);

	return (
		<Row gutter={[16, 16]} className="mb-12">
			Draft Order Detail
		</Row>
	);
}
