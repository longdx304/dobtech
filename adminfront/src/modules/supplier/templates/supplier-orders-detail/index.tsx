'use client';
import BackToOrders from '@/modules/supplier/components/supplier-order-detail/back-to-orders';
import Information from '@/modules/supplier/components/supplier-order-detail/information';
import Summary from '@/modules/supplier/components/supplier-order-detail/summary';
import { Col, Row } from 'antd';
import Documents from '../../components/supplier-order-detail/documents';
import SupplierOrderEditModalContainer from '../../components/supplier-order-detail/edit-supplier-order-modal';
import Timeline from '../../components/supplier-order-detail/timeline';
import { useAdminSupplierOrder } from '../../hooks';
import { useBuildTimeline } from '../../hooks/use-build-timeline';
import Payment from '../../components/supplier-order-detail/payment';

interface Props {
	id: string;
}

export default function SupplierOrdersDetail({ id }: Readonly<Props>) {
	const { data: supplierOrder, isLoading, refetch } = useAdminSupplierOrder(id);
	const { events, refetch: refetchTimeline } = useBuildTimeline(id);
	console.log('events:', events);

	const refetchOrder = () => {
		refetch();
		refetchTimeline();
	};

	return (
		<Row gutter={[16, 16]} className="mb-12">
			<Col span={24}>
				<BackToOrders />
			</Col>
			<Col xs={24} lg={14} className="flex flex-col gap-y-4">
				<Information supplierOrder={supplierOrder!} isLoading={isLoading} />
				<Summary
					supplierOrder={supplierOrder}
					isLoading={isLoading}
					reservations={[]}
					refetch={refetchOrder}
				/>
				<Documents order={supplierOrder} isLoading={isLoading} />

				<Payment
					supplierOrder={supplierOrder}
					isLoading={isLoading}
					refetch={refetchOrder}
				/>
				{/* <CustomerInfo order={order} isLoading={isLoading} /> */}
			</Col>
			<Col xs={24} lg={10}>
				<Timeline
					orderId={supplierOrder?.id}
					isLoading={isLoading}
					events={events}
					refetchOrder={refetch}
					refetch={refetchTimeline}
				/>
			</Col>
			{/* open the edit modal: add & update line item */}
			{supplierOrder && (
				<SupplierOrderEditModalContainer supplierOrder={supplierOrder} />
			)}
		</Row>
	);
}
