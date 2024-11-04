import { Supplier, SupplierOrders } from '@/types/supplier';
import dayjs from 'dayjs';

type Props = {
	supplier: Supplier[] | null;
};

const decideFulfillmentStt = (status: any) => {
	switch (status) {
		case 'pending':
			return 'Chờ thanh toán';
		case 'completed':
			return 'Đã thanh toán';
		case 'canceled':
			return 'Đã huỷ';
		default:
			return 'Xem xét';
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
		dataIndex: 'status',
		key: 'status',
		className: 'text-xs',
		render: (_: SupplierOrders['status']) => {
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
