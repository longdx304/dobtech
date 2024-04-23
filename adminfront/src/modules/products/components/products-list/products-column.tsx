import { Pencil, X } from 'lucide-react';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { IProductResponse } from '@/types/products';
import { Product } from '@medusajs/medusa';

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
					{record?.variants[0]?.prices[0]?.amount}
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
		render: (_: any, record: any) => (
			<Flex className="flex flex-col">
				<Button
					onClick={() => handleEditProduct(record)}
					type="text"
					shape="circle"
					icon={<Pencil />}
					data-testid="editProduct"
				/>
				<Button
					onClick={() => handleDeleteProduct(record.id)}
					type="text"
					shape="circle"
					icon={<X color="red" />}
					data-testid="deleteProduct"
				/>
			</Flex>
		),
	},
];

export default productsColumns;
