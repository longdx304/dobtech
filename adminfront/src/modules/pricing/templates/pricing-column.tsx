import { ActionAbles } from '@/components/Dropdown';
import { Pencil, Trash } from 'lucide-react';

type Props = {};

const pricingColumns = ({}: Props) => [
	{
		title: 'Tên',
		dataIndex: 'name',
		key: 'name',
		fixed: 'left',
		width: 150,
		className: 'text-xs',
	},
	{
		title: 'Mô tả',
		dataIndex: 'description',
		key: 'description',
		width: 150,
		className: 'text-xs',
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
		width: 150,
		className: 'text-xs',
	},
	{
		title: 'Nhom người dùng',
		dataIndex: 'customer_group',
		key: 'customer_group',
		width: 150,
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
					label: 'Sửa',
					icon: <Pencil size={20} />,
					onClick: () => {
						console.log('edit', record);
					},
				},
				{
					label: 'Xóa',
					icon: <Trash size={20} />,
					onClick: () => {
						console.log('delete', record);
					},
				},
			];

			return <ActionAbles actions={actions as any} />;
		},
	},
];

export default pricingColumns;
