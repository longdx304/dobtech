import { FulfillSupplierOrderStt, SupplierOrder } from '@/types/supplier';
import StatusDot from '@/modules/common/components/status-indicator';

import dayjs from 'dayjs';

const decideFulfillmentStt = (status: FulfillSupplierOrderStt) => {
	switch (status) {
		case FulfillSupplierOrderStt.DELIVERED:
			return <StatusDot variant="primary" title={'Đã giao hàng'} />;
		case FulfillSupplierOrderStt.INVENTORIED:
			return <StatusDot variant="success" title={'Hoàn thành nhập hàng'} />;
		default:
			return <StatusDot variant="primary" title={'N/A'} />;
	}
};
const inBoundColumn = [
	{
		title: 'Số đơn hàng',
		dataIndex: 'display_id',
		key: 'display_id',
		width: 60,
		fixed: 'left',
		className: 'text-xs',
		render: (_: SupplierOrder['display_id']) => {
			return `#${_}`;
		},
	},
	{
		title: 'Trạng thái',
		dataIndex: 'fulfillment_status',
		key: 'fulfillment_status',
		className: 'text-xs',
		render: (_: SupplierOrder['fulfillment_status']) => {
			return decideFulfillmentStt(_);
		},
	},
	{
		title: 'Ngày hoàn thành',
		dataIndex: 'inventoried_at',
		key: 'inventoried_at',
		className: 'text-xs',
		render: (_: SupplierOrder['inventoried_at']) => {
			return dayjs(_).format('DD/MM/YYYY');
		},
	},
];

export default inBoundColumn;
