import { ActionAbles } from '@/components/Dropdown';
import { ICustomerResponse } from '@/types/customer';
import dayjs from 'dayjs';
import { Boxes, Pencil } from 'lucide-react';

type Props = {
handleViewOrder: (record: ICustomerResponse) => void;
	handleEditCustomer: (record: ICustomerResponse) => void;
};

const customerColumns = ({ handleEditCustomer, handleViewOrder }: Props) => [
	{
		title: 'Mã khách hàng',
		dataIndex: 'customer_code',
		key: 'customer_code',
		width: 80,
		className: 'text-xs',
		render: (_: ICustomerResponse['customer_code']) => {
			return _ || '-';
		},
	},
	{
		title: 'Tên',
		dataIndex: 'name',
		key: 'name',
		fixed: 'left',
		width: 150,
		className: 'text-xs',
		render: (_: string, record: ICustomerResponse) => {
			return `${record.first_name || ''} ${record.last_name || ''}`;
		},
	},
	{
		title: 'Email',
		dataIndex: 'email',
		key: 'email',
		width: 100,
		className: 'text-xs',
	},
	{
		title: 'Số điện thoại',
		dataIndex: 'phone',
		key: 'phone',
		width: 80,
		className: 'text-xs',
		render: (_: string) => {
			return `${_ || '-'} `;
		},
	},
	{
		title: 'Đơn hàng',
		dataIndex: 'orders',
		key: 'orders',
		width: 80,
		className: 'text-xs',
		render: (_: ICustomerResponse['orders']) => {
			return _?.length || 0;
		},
	},
	{
		title: 'Địa chỉ',
		dataIndex: 'shipping_address',
		key: 'shipping_address',
		width: 150,
		className: 'text-xs',
		render: (_: ICustomerResponse['shipping_address'], record: ICustomerResponse) => {
			console.log('shipping_address', record.shipping_addresses);
			const shippingAddress = record.shipping_addresses?.[0] || null;
			return `${shippingAddress?.address_1 || ''} ${shippingAddress?.address_2 || ''} ${shippingAddress?.city || ''} ${shippingAddress?.province || ''} ${shippingAddress?.postal_code || ''}`;
		},
	},
		{
		title: 'Ngày tạo',
		dataIndex: 'created_at',
		key: 'created_at',
		width: 150,
		className: 'text-xs',
		sorter: (a: ICustomerResponse, b: ICustomerResponse) =>
			dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
		render: (_: ICustomerResponse['created_at']) => {
			return dayjs(_).format('DD/MM/YYYY');
		},
	},
	{
		title: '',
		key: 'action',
		width: 40,
		fixed: 'right',
		className: 'text-xs',
		align: 'center',
		render: (_: any, record: ICustomerResponse) => {
			const actions = [
				{
					label: 'Chỉnh sửa thông tin',
					icon: <Pencil size={20} />,
					onClick: () => {
						handleEditCustomer(record);
					},
				},
				{
					label: 'Danh sách đơn hàng',
					icon: <Boxes size={20} />,
					onClick: () => {
						handleViewOrder(record);
					},
				},
			];

			return <ActionAbles actions={actions as any} />;
		},
	},
];

export default customerColumns;
