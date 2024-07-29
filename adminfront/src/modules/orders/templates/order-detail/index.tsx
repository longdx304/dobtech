'use client';
import { useMemo, useEffect } from 'react';
import { Col, Row } from 'antd';
import { useAdminOrder, useAdminReservations } from 'medusa-react';

import BackToOrders from '@/modules/orders/components/orders/back-to-orders';
import Information from '@/modules/orders/components/orders/information';
import Timeline from '@/modules/orders/components/orders/timeline';
import Summary from '@/modules/orders/components/orders/summary';
import Payment from '@/modules/orders/components/orders/payment';
import Fulfillment from '@/modules/orders/components/orders/fulfillment';
import CustomerInfo from '@/modules/orders/components/orders/customer-info';
import OrderEditModalContainer from '@/modules/orders/components/orders/edit-order-modal';
import { useFeatureFlag } from '@/lib/providers/feature-flag-provider';

interface Props {
	id: string;
}

export default function OrderDetail({ id }: Props) {
	const { order, isLoading } = useAdminOrder(id!);

	const { isFeatureEnabled } = useFeatureFlag();

  const inventoryEnabled = useMemo(() => {
    return isFeatureEnabled("inventoryService")
  }, [isFeatureEnabled]);

	const { reservations, refetch: refetchReservations } = useAdminReservations(
    {
      line_item_id: order?.items.map((item) => item.id),
    },
    {
      enabled: inventoryEnabled,
    }
  )

	useEffect(() => {
    if (inventoryEnabled) {
      refetchReservations()
    }
  }, [inventoryEnabled, refetchReservations])


	return (
		<Row gutter={[16, 16]} className="mb-12">
				<Col span={24}>
					<BackToOrders />
				</Col>
				<Col xs={24} sm={14} md={14} className="flex flex-col gap-y-4">
					<Information order={order} isLoading={isLoading} />
					<Summary order={order} isLoading={isLoading} reservations={[]} />
					<Payment order={order} isLoading={isLoading} />
					<Fulfillment order={order} isLoading={isLoading} />
					<CustomerInfo order={order} isLoading={isLoading} />
				</Col>
				<Col xs={24} sm={10} md={10}>
					<Timeline orderId={order?.id} isLoading={isLoading} />
				</Col>
				{order && <OrderEditModalContainer order={order} />}
		</Row>
	);
}
