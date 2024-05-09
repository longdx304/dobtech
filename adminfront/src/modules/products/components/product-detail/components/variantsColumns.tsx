import { Pencil, Copy, Trash2 } from 'lucide-react';

import { Button } from '@/components/Button';
import { IProductResponse } from '@/types/products';
import { Product } from '@medusajs/medusa';
import { ActionAbles } from '@/components/Dropdown';

interface Props {
	// handleDeleteProduct: (userId: Product['id']) => void;
	// handleEditProduct: (record: IProductResponse) => void;
}
const variantsColumns = ({}: Props) => [
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
		render: (_: any, record: Product) => {
			const actions = [
				{
					label: <span className="w-full">Chỉnh sửa biến thể</span>,
					key: 'edit',
					icon: <Pencil size={20} />,
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
					// handleEditProduct(record);
					return;
				}
				// Case item is delete
				if (key === 'delete') {
					// handleDeleteProduct(record.id);
					return;
				}
			};

			return <ActionAbles actions={actions} onMenuClick={handleMenuClick} />;
		},
	},
];

export default variantsColumns;
