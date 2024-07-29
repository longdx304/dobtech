'use client';

import useIsDesktop from '@/modules/common/hooks/useIsDesktop';
import { Order } from '@medusajs/medusa';
import dynamic from 'next/dynamic';

const OrderOverviewMobile = dynamic(() => import('./OrderOverviewMobile'));
const OrderOverviewDesktop = dynamic(() => import('./OrderOverviewDesktop'));

const OrderOverview = ({ orders }: { orders: Order[] }) => {
	const isDesktop = useIsDesktop();

	return isDesktop ? (
		<OrderOverviewDesktop orders={orders} />
	) : (
		<OrderOverviewMobile orders={orders} />
	);
};

export default OrderOverview;
