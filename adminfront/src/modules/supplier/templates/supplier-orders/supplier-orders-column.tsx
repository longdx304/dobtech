import { Supplier, SupplierOrders } from '@/types/supplier';
import dayjs from 'dayjs';
import { Tag } from 'antd';

type Props = {
	supplier: Supplier[] | null;
};

const decidePaymentStt = (status: any) => {
	switch (status) {
		case 'pending':
			return <Tag color="warning">Chờ thanh toán</Tag>;
		case 'completed':
			return <Tag color="success">Đã thanh toán</Tag>;
		case 'canceled':
			return <Tag color="error">Đã huỷ</Tag>;
		default:
			return <Tag color="processing">Xem xét</Tag>;
	}
};

const decideFulfillmentStatus = (status: any) => {
	switch (status) {
		case 'not_fulfilled':
			return <Tag color="warning">Chưa hoàn thành</Tag>;
		case 'delivered':
			return <Tag color="cyan">Hàng đã về kho</Tag>;
		case 'partially_inventoried':
			return <Tag color="blue">Hoàn thành một phần</Tag>;
		case 'inventoried':
			return <Tag color="success">Đã nhập kho</Tag>;
		case 'rejected':
			return <Tag color="error">Đã hủy</Tag>;
		default:
			return <Tag color="default">N/A</Tag>;
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
		title: 'Nhập hàng',
		dataIndex: 'fulfillment_status',
		key: 'fulfillment_status',
		className: 'text-xs',
		render: (_: SupplierOrders['fulfillment_status']) => {
			return decideFulfillmentStatus(_);
		},
	},
	{
		title: 'Thanh toán',
		dataIndex: 'status',
		key: 'status',
		className: 'text-xs',
		render: (_: SupplierOrders['status']) => {
			return decidePaymentStt(_);
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
		title: 'Ngày hoàn thành',
		dataIndex: 'estimated_production_time',
		key: 'estimated_production_time',
		className: 'text-xs',
		render: (_: SupplierOrders['estimated_production_time']) => {
			return dayjs(_).format('DD/MM/YYYY');
		},
	},
];

export default supplierOrdersColumn;
