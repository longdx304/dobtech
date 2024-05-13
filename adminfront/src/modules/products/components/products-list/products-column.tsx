import { Pencil, X, MonitorX, Trash2, Dot } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@medusajs/medusa';

import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { IProductResponse } from '@/types/products';
import formatNumber from '@/lib/utils';
import { ActionAbles } from '@/components/Dropdown';
import Tooltip from '@/components/Tooltip/Tooltip';

interface Props {
	handleDeleteProduct: (userId: Product['id']) => void;
	handleEditProduct: (record: IProductResponse) => void;
}
const productsColumns = ({ handleDeleteProduct, handleEditProduct }: Props) => [
	{
		title: 'Tên sản phẩm',
		key: 'information',
		width: 200,
		className: 'text-xs',
		fixed: 'left',
		render: (_: any, record: Product) => (
			<Flex className="flex items-center gap-3">
				<Image
					src={record?.thumbnail ?? '/images/product-img.png'}
					alt="Product Thumbnail"
					width={30}
					height={40}
					className="rounded-md hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
				/>
				<Tooltip title={record.title}>
					<Text className="text-xs line-clamp-2">{record.title}</Text>
				</Tooltip>
			</Flex>
		),
	},
	{
		title: 'Bộ sưu tập',
		key: 'collection',
		dataIndex: 'collection',
		className: 'text-xs',
		width: 150,
		render: (_: Product['collection']) => {
			return _?.title || '-';
		},
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
		className: 'text-xs',
		width: 150,
		render: (_: Product['status'], record: Product) => {
			const color = _ === 'published' ? 'rgb(52 211 153)' : 'rgb(156 163 175)';
			return (
				<Flex justify="flex-start" align="center" gap="2px">
					<Dot
						color={_ === 'published' ? 'rgb(52 211 153)' : 'rgb(156 163 175)'}
						size={20}
						className="w-[20px]"
					/>
					<Text className="text-xs">{_ ? 'Đã xuất bản' : 'Bản nháp'}</Text>
				</Flex>
			);
		},
	},
	{
		title: 'Sẵn có',
		key: 'profile',
		dataIndex: 'profile',
		className: 'text-xs',
		width: 200,
		render: (_: Product['profile']) => {
			return _?.name || '-';
		},
	},
	{
		title: 'Tồn kho',
		key: 'variants',
		dataIndex: 'variants',
		className: 'text-xs',
		width: 250,
		render: (_: Product['variants']) => {
			const total = _.reduce(
				(acc, variant) => acc + variant.inventory_quantity,
				0
			);
			return `${formatNumber(total)} còn hàng cho ${_?.length || 0} biến thể`;
		},
	},
	{
		title: '',
		key: 'action',
		width: 40,
		fixed: 'right',
		className: 'text-xs px-0',
		align: 'center',
		render: (_: any, record: any) => {
			const actions = [
				{
					label: <span className="w-full">Chỉnh sửa</span>,
					key: 'edit',
					icon: <Pencil size={20} />,
				},
				{
					label: <span className="w-full">Ngừng xuất bản</span>,
					key: 'stop-publishing',
					icon: <MonitorX size={20} />,
				},
				{
					label: <span className="w-full">Xoá</span>,
					key: 'delete',
					icon: <Trash2 size={20} />,
					danger: true,
				},
			];

			const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
				if (key === 'edit') {
					handleEditProduct(record);
					return;
				}
				// Case item is delete
				if (key === 'delete') {
					handleDeleteProduct(record.id);
					return;
				}
			};

			return <ActionAbles actions={actions} onMenuClick={handleMenuClick} />;
		},
	},
];

export default productsColumns;
