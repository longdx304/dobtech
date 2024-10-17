import { Supplier, SupplierOrders } from '@/types/supplier';
import dayjs from 'dayjs';

type Props = {
	supplier: Supplier[] | null;
};

const decideFulfillmentStt = (status: any) => {
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
const supplierOrdersColumn = ({ supplier }: Props) => [
	{
		title: 'STT',
		dataIndex: 'display_id',
		key: 'display_id',
		width: 60,
		fixed: 'left',
		className: 'text-xs',
		render: (_: SupplierOrders['display_id']) => {
			return `#${_}`;
		},
	},
	{
		title: 'Nhà cung cấp',
		dataIndex: 'supplier_id',
		key: 'supplier_id',
		width: 150,
		className: 'text-xs',
		render: (_: SupplierOrders['id'], record: SupplierOrders) => {
			const supplierName = supplier?.find(
				(item) => item.id === _
			)?.supplier_name;

			return supplierName || '-';
		},
	},
	{
		title: 'Thanh toán',
		dataIndex: 'fulfillment_status',
		key: 'fulfillment_status',
		className: 'text-xs',
		render: (_: SupplierOrders['fulfillment_status']) => {
			return decideFulfillmentStt(_);
		},
	},
	{
		title: 'Ngày hoàn thành',
		dataIndex: 'estimated_production_time',
		key: 'estimated_production_time',
		className: 'text-xs',
		render: (_: SupplierOrders['estimated_production_time']) => {
			return dayjs(_).format('DD/MM/YYYY');
		},
	},
	{
		title: 'Ngày thanh toán',
		dataIndex: 'settlement_time',
		key: 'settlement_time',
		className: 'text-xs',
		render: (_: SupplierOrders['settlement_time']) => {
			return dayjs(_).format('DD/MM/YYYY');
		},
	},
	{
		title: 'Ngày đặt hàng',
		dataIndex: 'created_at',
		key: 'created_at',
		className: 'text-xs',
		render: (_: SupplierOrders['created_at']) => {
			return dayjs(_).format('DD/MM/YYYY');
		},
	},
];

export default supplierOrdersColumn;
