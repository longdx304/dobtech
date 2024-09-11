import { ActionAbles } from '@/components/Dropdown';
import { formatNumber } from '@/lib/utils';
import { Supplier, SupplierOrders } from '@/types/supplier';
import { Pencil, Trash2 } from 'lucide-react';

type Props = {
	handleEditSupplierOrders: (record: SupplierOrders) => void;
	handleDeleteSupplierOrders: (id: string) => void;
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
const supplierOrdersColumn = ({
	handleEditSupplierOrders,
	handleDeleteSupplierOrders,
}: Props) => [
	{
		title: 'Đơn hàng',
		dataIndex: 'display_id',
		key: 'display_id',
		width: 120,
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
		render: (_: SupplierOrders['id'], record: Supplier) => {
			// has id, take supplier name
			return _ || '-';
		}
	},
	{
		title: 'Trạng thái thanh toán',
		dataIndex: 'fulfillment_status',
		key: 'fulfillment_status',
		className: 'text-xs',
		render: (_: SupplierOrders['fulfillment_status']) => {
			return decideFulfillmentStt(_);
		},
	},
	{
		title: 'Tổng tiền',
		dataIndex: 'total',
		key: 'total',
		className: 'text-xs',
		render: (_: any) => {
			return `${formatNumber(_)}đ`;
		},
	},
	{
		title: 'Ngày thêm',
		dataIndex: 'created_at',
		key: 'created_at',
		className: 'text-xs',
	},
	{
		title: '',
		key: 'action',
		width: 40,
		fixed: 'right',
		className: 'text-xs',
		align: 'center',
		render: (_: any, record: any) => {
			const actions = [
				{
					label: 'Chỉnh sửa thông tin',
					icon: <Pencil size={20} />,
					onClick: () => {
						handleEditSupplierOrders(record);
					},
				},
				{
					label: 'Xoá',
					danger: true,
					icon: <Trash2 size={20} />,
					onClick: () => {
						handleDeleteSupplierOrders(record.id);
					},
				},
			];

			return <ActionAbles actions={actions as any} />;
		},
	},
];

export default supplierOrdersColumn;
