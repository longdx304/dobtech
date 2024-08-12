'use client';
import { Col, Row } from 'antd';
import { useAdminOrder } from 'medusa-react';

import BackToOrders from '@/modules/orders/components/orders/back-to-orders';
import Information from '@/modules/orders/components/orders/information';
import Timeline from '@/modules/orders/components/orders/timeline';
import Summary from '@/modules/orders/components/orders/summary';
import Payment from '@/modules/orders/components/orders/payment';
import Fulfillment from '@/modules/orders/components/orders/fulfillment';
import CustomerInfo from '@/modules/orders/components/orders/customer-info';
import OrderEditModalContainer from '@/modules/orders/components/orders/edit-order-modal';
import { useBuildTimeline } from '../../hooks/use-build-timeline';

interface Props {
	id: string;
}

export default function OrderDetail({ id }: Readonly<Props>) {
	const { order, isLoading, refetch } = useAdminOrder(id);
	const { events, refetch: refetchTimeline } = useBuildTimeline(id);

	const refetchOrder = () => {
		refetch();
		refetchTimeline();
	}
	return (
		<Row gutter={[16, 16]} className="mb-12">
			<Col span={24}>
				<BackToOrders />
			</Col>
			<Col xs={24} lg={14} className="flex flex-col gap-y-4">
				<Information order={order} isLoading={isLoading} />
				<Summary
					order={order}
					isLoading={isLoading}
					reservations={[]}
					refetch={refetch}
				/>
				<Payment order={order} isLoading={isLoading} refetch={refetchOrder} />
				<Fulfillment order={order} isLoading={isLoading} refetch={refetch} />
				<CustomerInfo order={order} isLoading={isLoading} />
			</Col>
			<Col xs={24} lg={10}>
				<Timeline
					orderId={order?.id}
					isLoading={isLoading}
					events={events}
					refetchOrder={refetch}
					refetch={refetchTimeline}
				/>
			</Col>
			{order && <OrderEditModalContainer order={order} />}
		</Row>
	);
}
