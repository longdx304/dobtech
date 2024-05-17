import { Copy, Pencil, Trash2 } from 'lucide-react';

import { ActionAbles } from '@/components/Dropdown';
import { ProductVariant } from '@medusajs/medusa';
import { MenuProps } from 'antd';

interface Props {
	handleDeleteVariant: (variantId: ProductVariant['id']) => void;
	handleEditVariant: (record: ProductVariant) => void;
	handleCopyVariant: (record: ProductVariant) => void;
}
const variantsColumns = ({
	handleEditVariant,
	handleDeleteVariant,
	handleCopyVariant,
}: Props) => [
	{
		title: 'Tiêu đề',
		dataIndex: 'title',
		key: 'title',
	},
	{
		title: 'SKU',
		dataIndex: 'sku',
		key: 'sku',
	},
	{
		title: 'EAN',
		dataIndex: 'ean',
		key: 'ean',
	},
	{
		title: 'Tồn kho',
		dataIndex: 'inventory_quantity',
		key: 'inventory_quantity',
	},
	{
		title: '',
		key: 'action',
		width: 40,
		fixed: 'right',
		render: (_: any, record: ProductVariant) => {
			const actions = [
				{
					label: <span className="w-full">Chỉnh sửa biến thể</span>,
					key: 'edit',
					icon: <Pencil size={20} />,
					// onClick: handleEditVariant(record),
				},
				{
					label: <span className="w-full">Nhân bản biến thể</span>,
					key: 'copy',
					icon: <Copy size={20} />,
				},
				{
					label: <span className="w-full">Xoá biến thể</span>,
					key: 'delete',
					icon: <Trash2 size={20} />,
					danger: true,
				},
			];

			const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
				if (key === 'edit') {
					handleEditVariant(record);
					return;
				}
				// Case item is delete
				if (key === 'delete') {
					handleDeleteVariant(record.id);
					return;
				}
				if (key === 'copy') {
					handleCopyVariant(record);
					return;
				}
			};

			return <ActionAbles actions={actions} onMenuClick={handleMenuClick} />;
		},
	},
];

export default variantsColumns;
