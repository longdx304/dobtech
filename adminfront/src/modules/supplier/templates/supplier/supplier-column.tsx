import { ActionAbles } from '@/components/Dropdown';
import { Supplier } from '@/types/supplier';
import { Pencil, Trash2 } from 'lucide-react';

type Props = {
	// handleViewOrder: (record: Supplier) => void;
	handleEditSupplier: (record: Supplier) => void;
	handleDeleteSupplier: (id: string) => void;
};

const supplierColumn = ({
	handleEditSupplier,
	handleDeleteSupplier,
}: Props) => [
	{
		title: 'Tên',
		dataIndex: 'supplier_name',
		key: 'supplier_name',
		fixed: 'left',
		width: 150,
		className: 'text-xs',
	},
	{
		title: 'Email',
		dataIndex: 'email',
		key: 'email',
		width: 150,
		className: 'text-xs',
	},
	{
		title: 'Thời gian sản xuất',
		dataIndex: 'estimated_production_time',
		key: 'estimated_production_time',
		width: 150,
		className: 'text-xs',
		render: (_: Supplier['estimated_production_time']) => {
			return _ + ' ngày';
		},
	},
	{
		title: 'Thời gian quyết toán',
		dataIndex: 'settlement_time',
		key: 'settlement_time',
		width: 150,
		className: 'text-xs',
		render: (_: Supplier['settlement_time']) => {
			return _ + ' ngày';
		},
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
						handleEditSupplier(record);
					},
				},
				{
					label: 'Xoá',
					danger: true,
					icon: <Trash2 size={20} />,
					onClick: () => {
						handleDeleteSupplier(record.id);
					},
				},
			];

			return <ActionAbles actions={actions as any} />;
		},
	},
];

export default supplierColumn;
