import { Tag } from '@/components/Tag';
import { formatNumber } from '@/lib/utils';
import { Order } from '@medusajs/medusa';
import dayjs from 'dayjs';

type Props = {};

const decidePaymentStatus = (status: string) => {
	switch (status) {
		case 'captured':
			return <Tag color="success">Đã thanh toán</Tag>;
		case 'partially_refunded':
			return <Tag color="processing">Đã hoàn một phần</Tag>;
		case 'awaiting':
			return <Tag color="warning">Chờ xử lý</Tag>;
		case 'requires_action':
			return <Tag color="error">Yêu cầu xử lý</Tag>;
		case 'canceled':
			return <Tag color="default">Đã hủy</Tag>;
		default:
			return <Tag color="default">N/A</Tag>;
	}
};

const decideFulfillmentStatus = (status: string) => {
	switch (status) {
		case 'not_fulfilled':
			return <Tag color="warning">Chưa hoàn thành</Tag>;
		case 'partially_fulfilled':
			return <Tag color="processing">Hoàn thành một phần</Tag>;
		case 'fulfilled':
			return <Tag color="success">Đã hoàn thành</Tag>;
		case 'partially_shipped':
			return <Tag color="processing">Gửi hàng một phần</Tag>;
		case 'shipped':
			return <Tag color="success">Đã gửi hàng</Tag>;
		case 'partially_returned':
			return <Tag color="warning">Trả lại một phần</Tag>;
		case 'returned':
			return <Tag color="default">Đã trả lại</Tag>;
		case 'canceled':
			return <Tag color="default">Đã hủy</Tag>;
		case 'requires_action':
			return <Tag color="error">Yêu cầu xử lý</Tag>;
		default:
			return <Tag color="default">N/A</Tag>;
	}
};

const orderColumns = ({}: Props) => [
	{
		title: 'Đơn hàng',
		dataIndex: 'display_id',
		key: 'display_id',
		fixed: 'left',
		width: 100,
		className: 'text-xs',
		render: (_: Order['display_id']) => {
			return <Tag bordered={false}>#{_}</Tag>;
		},
	},
	{
		title: 'Khách hàng',
		dataIndex: 'shipping_address',
		key: 'shipping_address',
		fixed: 'center',
		className: 'text-xs text-center',
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
		filters: [
			{ text: 'Chưa hoàn thành', value: 'not_fulfilled' },
			{ text: 'Hoàn thành một phần', value: 'partially_fulfilled' },
			{ text: 'Đã hoàn thành', value: 'fulfilled' },
			{ text: 'Gửi hàng một phần', value: 'partially_shipped' },
			{ text: 'Đã gửi hàng', value: 'shipped' },
			{ text: 'Trả lại một phần', value: 'partially_returned' },
			{ text: 'Đã trả lại', value: 'returned' },
			{ text: 'Đã hủy', value: 'canceled' },
			{ text: 'Yêu cầu xử lý', value: 'requires_action' },
		],
		render: (_: Order['fulfillment_status']) => {
			return decideFulfillmentStatus(_);
		},
	},
	{
		title: 'Trạng thái đơn hàng',
		dataIndex: 'payment_status',
		key: 'payment_status',
		className: 'text-xs',
		filters: [
			{ text: 'Đã thanh toán', value: 'captured' },
			{ text: 'Đã hoàn một phần', value: 'partially_refunded' },
			{ text: 'Chờ xử lý', value: 'awaiting' },
			{ text: 'Yêu cầu xử lý', value: 'requires_action' },
			{ text: 'Đã hủy', value: 'canceled' },
		],
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
		sorter: (a: any, b: any) => a.total - b.total,
		render: (_: Order['total']) => {
			return formatNumber(_);
		},
	},
	{
		title: 'Ngày đặt hàng',
		dataIndex: 'created_at',
		key: 'created_at',
		className: 'text-xs',
		sorter: (a: any, b: any) =>
			dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
		render: (_: Order['created_at']) => {
			return dayjs(_).format('DD/MM/YYYY');
		},
	},
];

export default orderColumns;
