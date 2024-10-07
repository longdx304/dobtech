'use client';
import BackToOrders from '@/modules/supplier/components/supplier-order-detail/back-to-orders';
import Information from '@/modules/supplier/components/supplier-order-detail/information';
import Summary from '@/modules/supplier/components/supplier-order-detail/summary';
import { SupplierOrder } from '@/types/supplier';
import { Col, Row } from 'antd';
import { useMemo } from 'react';
import SupplierOrderEditModalContainer from '../../components/supplier-order-detail/edit-supplier-order-modal';
import { useAdminSupplierOrder } from '../../hooks';
import Timeline from '../../components/supplier-order-detail/timeline';

interface Props {
	id: string;
}

export default function SupplierOrdersDetail({ id }: Readonly<Props>) {
	const { data, isLoading, refetch } = useAdminSupplierOrder(id);
	const supplierOrder = (data as any)?.supplierOrder as SupplierOrder;

	const order = useMemo(() => {
		return {
			id: supplierOrder?.id,
			display_id: supplierOrder?.display_id,
			status: supplierOrder?.status,
			user: supplierOrder?.user,
			supplier: supplierOrder?.supplier,
			cart: supplierOrder?.cart,
			payment_status: supplierOrder?.payment_status,
			tax_rate: supplierOrder?.tax_rate,
		};
	}, [supplierOrder]);

	const refetchOrder = () => {
		refetch();
	};
	return (
		<Row gutter={[16, 16]} className="mb-12">
			<Col span={24}>
				<BackToOrders />
			</Col>
			<Col xs={24} lg={14} className="flex flex-col gap-y-4">
				<Information order={order!} isLoading={isLoading} />
				<Summary
					order={order!}
					isLoading={isLoading}
					reservations={[]}
					refetch={refetchOrder}
				/>
				{/* <Payment order={order} isLoading={isLoading} refetch={refetchOrder} />
				<CustomerInfo order={order} isLoading={isLoading} /> */}
			</Col>
			<Col xs={24} lg={10}>
				{/* <Timeline
					orderId={order?.id}
					isLoading={isLoading}
					events={events}
					refetchOrder={refetch}
					refetch={refetchTimeline}
				/> */}
			</Col>
			{/* open the edit modal: add & update line item */}
			{order && <SupplierOrderEditModalContainer order={order} />}
		</Row>
	);
}
