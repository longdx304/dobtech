import { ActionAbles } from '@/components/Dropdown';
import { Order } from '@medusajs/medusa';
import dayjs from 'dayjs';
import { Truck, Pencil, Trash2 } from 'lucide-react';
import StatusDot from '@/modules/common/components/status-indicator';
import { formatNumber } from '@/lib/utils';
import { format } from 'date-fns';

type Props = {};

const decidePaymentStatus = (status) => {
	switch (status) {
		case 'captured':
			return <StatusDot variant="success" title={'Đã thanh toán'} />;
		case 'awaiting':
			return <StatusDot variant="default" title={'Chờ xử lý'} />;
		case 'requires_action':
			return <StatusDot variant="danger" title={'Yêu cầu xử lý'} />;
		case 'canceled':
			return <StatusDot variant="warning" title={'Đã hủy'} />;
		default:
			return <StatusDot variant="primary" title={'N/A'} />;
	}
};

const decideFulfillmentStt = (status) => {
	switch (status) {
		case 'not_fulfilled':
			return 'Chưa hoàn thành';
		case 'partially_fulfilled':
			return 'Hoàn thành một phần';
		case 'fulfilled':
			return 'Đã hoàn thành';
		case 'partially_shipped':
			return 'Gửi hàng một phần';
		case 'shipped':
			return 'Đã gửi hàng';
		case 'partially_returned':
			return 'Trả lại một phần';
		case 'returned':
			return 'Đã trả lại';
		case 'canceled':
			return 'Đã hủy';
		case 'requires_action':
			return 'Yêu cầu xử lý';
	}
};

const orderColumns = ({ }: Props) => [
	{
		title: 'Đơn hàng',
		dataIndex: 'display_id',
		key: 'display_id',
		fixed: 'left',
		// width: 150,
		className: 'text-xs',
		render: (_: Order['display_id']) => {
			return `#${_}`;
		},
	},
	{
		title: 'Khách hàng',
		dataIndex: 'shipping_address',
		key: 'shipping_address',
		width: 150,
		className: 'text-xs',
		render: (_: Order['shipping_address'], record: Order) => {
			let name = null;
			if (_?.first_name || _?.last_name) {
				name = `${_?.last_name} ${_?.first_name}`;
			} else if (record?.customer?.first_name || record?.customer?.last_name) {
				name = `${record?.customer?.last_name} ${record?.customer?.first_name}`;
			} else {
				name = `${record.email}`;
			}
			return name;
		},
	},
	{
		title: 'Giao hàng',
		dataIndex: 'fulfillment_status',
		key: 'fulfillment_status',
		// width: 150,
		className: 'text-xs',
		render: (_: Order['fulfillment_status']) => {
			return decideFulfillmentStt(_);
		},
	},
	{
		title: 'Trạng thái thanh toán',
		dataIndex: 'payment_status',
		key: 'payment_status',
		width: 150,
		className: 'text-xs',
		render: (_: Order['payment_status']) => {
			return decidePaymentStatus(_);
		},
	},
	{
		title: 'Tổng tiền',
		dataIndex: 'total',
		key: 'total',
		// width: 150,
		className: 'text-xs',
		render: (_: Order['total']) => {
			return formatNumber(_);
		},
	},
	{
		title: 'Ngày thêm',
		dataIndex: 'created_at',
		key: 'created_at',
		// width: 150,
		className: 'text-xs',
		render: (_: Order['created_at']) => {
			return dayjs(_).format('DD/MM/YYYY');
		},
	},
];

export default orderColumns;
