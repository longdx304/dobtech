import { formatNumber } from '@/lib/utils';
import StatusDot from '@/modules/common/components/status-indicator';
import { DraftOrder, Order } from '@medusajs/medusa';
import dayjs from 'dayjs';

type Props = {};

const decidePaymentStatus = (status: any) => {
	switch (status) {
		case 'open':
			return <StatusDot variant="default" title={'Đang xử lý'} />;
		case 'completed':
			return <StatusDot variant="success" title={'Đã thanh toán'} />;
		default:
			return <StatusDot variant="primary" title={'N/A'} />;
	}
};

const draftOrderColumns = ({}: Props) => [
	{
		title: 'Bản nháp',
		dataIndex: 'display_id',
		key: 'display_id',
		fixed: 'left',
		// width: 150,
		className: 'text-xs',
		render: (_: DraftOrder['display_id']) => {
			return `#${_}`;
		},
	},
	{
		title: 'Đơn hàng',
		dataIndex: 'order',
		key: 'order',
		// width: 150,
		className: 'text-xs',
		render: (_: any, record: DraftOrder) => {
			const orderId = record.order?.display_id;
			return orderId ? `#${orderId}` : '-';
		},
	},
	{
		title: 'Khách ',
		dataIndex: 'customer',
		key: 'customer',
		// width: 150,
		className: 'text-xs',
		render: (_: any, record: DraftOrder) => {
			const customerEmail = record.cart?.email;
			return customerEmail || '-';
		},
	},
	{
		title: 'Trạng thái thanh toán',
		dataIndex: 'status',
		key: 'status',
		width: 150,
		className: 'text-xs',
		render: (_: DraftOrder['status']) => {
			return decidePaymentStatus(_);
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

export default draftOrderColumns;
