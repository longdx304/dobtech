import { Pencil, X, MonitorX, Trash2 } from 'lucide-react';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { IProductResponse } from '@/types/products';
import { Product } from '@medusajs/medusa';
import formatNumber from '@/lib/utils';
import { ActionAbles } from '@/components/Dropdown';

interface Props {
	handleDeleteProduct: (userId: Product['id']) => void;
	handleEditProduct: (record: IProductResponse) => void;
}
const productsColumns = ({ handleDeleteProduct, handleEditProduct }: Props) => [
	{
		title: 'Tên sản phẩm',
		key: 'information',
		render: (_: any, record: any) => (
			<Flex className="flex items-center gap-3">
				<Avatar
					src={
						<img
							src={record?.thumbnail ?? '/images/product-img.png'}
							alt="avatar"
						/>
					}
				/>
				<Flex vertical gap="small" className="flex flex-col items-center">
					<Text strong>{record.title}</Text>
					<Text className="text-xs">
						{record?.variants.map((variant: any) => {
							const colorOption = record.options.find((option: any) => {
								return (
									option.values.some(
										(value: any) => value.variant_id === variant.id
									) && option.title === 'Color'
								);
							});

							const colorValue =
								colorOption?.values.find(
									(value: any) => value.variant_id === variant.id
								)?.value || 'N/A';

							return (
								<div key={variant.id}>
									<span>
										{variant.title} / {colorValue}
										<br />
									</span>
								</div>
							);
						})}
					</Text>
				</Flex>
			</Flex>
		),
	},
	{
		title: 'Giá bán',
		dataIndex: 'price',
		key: 'price',
		render: (_: any, record: any) => (
			<Flex vertical gap="small">
				<Text strong className="text-xs">
					{formatNumber(record?.variants[0]?.prices[0]?.amount)}đ
				</Text>
				<Text className="text-xs">
					{record?.variants.map((variant: any) => {
						return (
							<div className="text-blue-500" key={variant.id}>
								<span>
									SLTK: {variant.inventory_quantity}
									<br />
								</span>
							</div>
						);
					})}
				</Text>
			</Flex>
		),
	},
	{
		title: 'Action',
		key: 'action',
		width: 40,
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

			return (
				<ActionAbles actions={actions} onMenuClick={handleMenuClick} />
		)},
	},
];

export default productsColumns;
