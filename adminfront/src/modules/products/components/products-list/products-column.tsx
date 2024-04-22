import { PackageSearch, Pencil, X } from 'lucide-react';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Typography';
import { IProductResponse } from '@/types/products';
import { Product } from '@medusajs/medusa';
import Image from 'next/image';

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
						{record?.variants.map((variant: any) => (
							<span key={variant.id}>
								{variant.title} / {variant.options[0]?.value}
								<br />
							</span>
						))}
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
							<div className="text-blue-500">
								<span key={variant.id}>
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
				/>
				<Button
					onClick={() => handleDeleteProduct(record.id)}
					type="text"
					shape="circle"
					icon={<X color="red" />}
				/>
			</Flex>
		),
	},
];

export default productsColumns;
