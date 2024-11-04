'use client';

import useIsDesktop from '@/modules/common/hooks/useIsDesktop';
import { Order } from '@medusajs/medusa';
import OrderOverviewDesktop from './OrderOverviewDesktop';
import OrderOverviewMobile from './OrderOverviewMobile';

const OrderOverview = ({ orders }: { orders: Order[] }) => {
	const isDesktop = useIsDesktop();

	return isDesktop ? (
		<OrderOverviewDesktop orders={orders} />
	) : (
		<OrderOverviewMobile orders={orders} />
	);
};

export default OrderOverview;
